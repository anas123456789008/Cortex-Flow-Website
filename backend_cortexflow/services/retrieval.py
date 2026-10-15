"""
RAG step 3: find the chunks that best match a question.

This uses BM25, a keyword ranking method. It needs no API key and no extra
libraries, so the project runs anywhere.

To upgrade to semantic (embedding) search later, keep the same function
`retrieve(question, chunks, top_k)` and change only its inside, for example
using sentence-transformers + pgvector in Supabase.
"""

import math
import re
from collections import Counter

from ..models import Chunk

STOP_WORDS = {
    "a", "an", "the", "is", "are", "was", "were", "of", "to", "in", "on", "for", "and",
    "or", "it", "this", "that", "with", "as", "by", "be", "at", "from", "what", "how",
    "do", "does", "can", "i", "my", "me", "you", "your",
}


def tokenize(text: str) -> list[str]:
    words = re.findall(r"[a-z0-9]+", text.lower())
    return [w for w in words if w not in STOP_WORDS]


def retrieve(question: str, chunks: list[Chunk], top_k: int = 4,
             k1: float = 1.5, b: float = 0.75) -> list[tuple[Chunk, float]]:
    """Return the best `top_k` chunks as (chunk, score), highest score first."""
    query_terms = set(tokenize(question))
    if not chunks or not query_terms:
        return []

    docs = [tokenize(c.text) for c in chunks]
    avg_len = sum(len(d) for d in docs) / len(docs) or 1
    n = len(docs)

    # How many chunks contain each query word
    doc_freq = {t: sum(1 for d in docs if t in d) for t in query_terms}

    scored = []
    for chunk, words in zip(chunks, docs):
        counts = Counter(words)
        score = 0.0
        for term in query_terms:
            tf = counts.get(term, 0)
            if tf == 0:
                continue
            idf = math.log(1 + (n - doc_freq[term] + 0.5) / (doc_freq[term] + 0.5))
            score += idf * tf * (k1 + 1) / (tf + k1 * (1 - b + b * len(words) / avg_len))
        if score > 0:
            scored.append((chunk, round(score, 3)))

    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_k]
