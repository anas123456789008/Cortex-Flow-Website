"""
RAG step 4: answer a question using only the retrieved document text.

Full flow:  upload -> extract text -> chunk -> store
            question -> retrieve best chunks -> ask the LLM with those chunks -> answer + sources
"""

import os

from ..models import Chunk, Document
from .document_loader import extract_text, split_into_chunks
from .retrieval import retrieve

NO_ANSWER = "I could not find this in your uploaded documents."


def ingest_document(user_id: str, filename: str, data: bytes) -> tuple[Document, list[Chunk]]:
    """Read an uploaded file and prepare it for search."""
    text = extract_text(filename, data)
    pieces = split_into_chunks(text)
    if not pieces:
        raise ValueError("No readable text was found in this file.")

    doc = Document(user_id=user_id, filename=filename, num_chunks=len(pieces))
    chunks = [Chunk(document_id=doc.id, user_id=user_id, filename=filename, index=i, text=p)
              for i, p in enumerate(pieces)]
    return doc, chunks


def _ask_llm(question: str, context: str) -> str | None:
    """Ask Claude to answer from the context. Returns None if no API key / on error."""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return None
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        msg = client.messages.create(
            model=os.getenv("CORTEXFLOW_MODEL", "claude-sonnet-4-5"),
            max_tokens=600,
            system=("You answer questions using ONLY the document excerpts provided. "
                    "If the answer is not in the excerpts, reply exactly: "
                    f"'{NO_ANSWER}' Use simple, plain English. "
                    "Mention the excerpt number like [1] when you use it."),
            messages=[{"role": "user",
                       "content": f"Excerpts:\n{context}\n\nQuestion: {question}"}],
        )
        return msg.content[0].text
    except Exception:
        return None


def answer_from_documents(question: str, all_chunks: list[Chunk], top_k: int = 4) -> dict:
    """Retrieve the best chunks, then build an answer with sources."""
    hits = retrieve(question, all_chunks, top_k=top_k)
    if not hits:
        return {"answer": NO_ANSWER, "sources": [], "used_llm": False}

    context = "\n\n".join(f"[{i}] ({c.filename}) {c.text}" for i, (c, _) in enumerate(hits, 1))
    llm_answer = _ask_llm(question, context)

    if llm_answer:
        answer, used_llm = llm_answer, True
    else:
        # Fallback with no API key: show the best matching passage
        best_chunk, _ = hits[0]
        answer = f"Best match from {best_chunk.filename}:\n{best_chunk.text}"
        used_llm = False

    sources = [{"ref": i, "document_id": c.document_id, "filename": c.filename,
                "chunk_index": c.index, "score": score,
                "excerpt": c.text[:300] + ("..." if len(c.text) > 300 else "")}
               for i, (c, score) in enumerate(hits, 1)]
    return {"answer": answer, "sources": sources, "used_llm": used_llm}
