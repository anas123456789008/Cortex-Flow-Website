-- =====================================================================
-- PART 1: Catch up the live database to match the app's existing code.
-- profiles already exists, so it's skipped. Everything else is created
-- with IF NOT EXISTS / safe guards so this can be re-run without error.
-- =====================================================================

-- financial_documents
CREATE TABLE IF NOT EXISTS public.financial_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  document_type TEXT,
  file_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded',
  upload_date TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_documents TO authenticated;
GRANT ALL ON public.financial_documents TO service_role;
ALTER TABLE public.financial_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own docs" ON public.financial_documents;
CREATE POLICY "own docs" ON public.financial_documents FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  occurred_on DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  amount NUMERIC(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income','expense')),
  document_id UUID REFERENCES public.financial_documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own txn" ON public.transactions;
CREATE POLICY "own txn" ON public.transactions FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_txn_user_date ON public.transactions(user_id, occurred_on DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_document_id ON public.transactions(document_id);

-- chat_history
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_history TO authenticated;
GRANT ALL ON public.chat_history TO service_role;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own chat" ON public.chat_history;
CREATE POLICY "own chat" ON public.chat_history FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_chat_session ON public.chat_history(user_id, session_id, created_at);

-- recommendations
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recommendations TO authenticated;
GRANT ALL ON public.recommendations TO service_role;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own recs" ON public.recommendations;
CREATE POLICY "own recs" ON public.recommendations FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Storage bucket for documents (private, not public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('financial-documents', 'financial-documents', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "own files read" ON storage.objects;
CREATE POLICY "own files read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'financial-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "own files insert" ON storage.objects;
CREATE POLICY "own files insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'financial-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "own files delete" ON storage.objects;
CREATE POLICY "own files delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'financial-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================================
-- PART 2: RAG pipeline additions
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE public.financial_documents
  ADD COLUMN IF NOT EXISTS extracted_text TEXT,
  ADD COLUMN IF NOT EXISTS processing_stage TEXT NOT NULL DEFAULT 'uploaded',
  ADD COLUMN IF NOT EXISTS error_code TEXT,
  ADD COLUMN IF NOT EXISTS error_message TEXT,
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

DO $$ BEGIN
  ALTER TABLE public.financial_documents
    ADD CONSTRAINT financial_documents_processing_stage_check
    CHECK (processing_stage IN (
      'uploaded', 'loading', 'extracting', 'normalizing',
      'chunking', 'embedding', 'indexing', 'testing', 'completed', 'failed'
    ));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.financial_documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  token_count INT,
  embedding VECTOR(768),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (document_id, chunk_index)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_chunks TO authenticated;
GRANT ALL ON public.document_chunks TO service_role;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own chunks" ON public.document_chunks;
CREATE POLICY "own chunks" ON public.document_chunks FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_chunks_document ON public.document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_chunks_user ON public.document_chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_chunks_embedding
  ON public.document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE TABLE IF NOT EXISTS public.rag_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','passed','warning','failed')),
  health_score INT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rag_scans TO authenticated;
GRANT ALL ON public.rag_scans TO service_role;
ALTER TABLE public.rag_scans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own scans" ON public.rag_scans;
CREATE POLICY "own scans" ON public.rag_scans FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_scans_user ON public.rag_scans(user_id, started_at DESC);

CREATE TABLE IF NOT EXISTS public.rag_scan_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID NOT NULL REFERENCES public.rag_scans(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  stage_order INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','passed','warning','failed','skipped')),
  duration_ms INT,
  message TEXT,
  input_count INT,
  output_count INT,
  error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rag_scan_stages TO authenticated;
GRANT ALL ON public.rag_scan_stages TO service_role;
ALTER TABLE public.rag_scan_stages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own scan stages" ON public.rag_scan_stages;
CREATE POLICY "own scan stages" ON public.rag_scan_stages FOR ALL
  USING (EXISTS (SELECT 1 FROM public.rag_scans s WHERE s.id = rag_scan_stages.scan_id AND s.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.rag_scans s WHERE s.id = rag_scan_stages.scan_id AND s.user_id = auth.uid()));
CREATE INDEX IF NOT EXISTS idx_scan_stages_scan ON public.rag_scan_stages(scan_id, stage_order);
