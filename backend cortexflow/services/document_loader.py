"""RAG step 1 and 2: read text from an uploaded file, then split it into chunks."""

import io
import re

SUPPORTED = (".txt", ".md", ".csv", ".pdf", ".docx")


def extract_text(filename: str, data: bytes) -> str:
    """Turn an uploaded file into plain text."""
    name = filename.lower()

    if name.endswith((".txt", ".md", ".csv")):
        return data.decode("utf-8", errors="ignore")

    if name.endswith(".pdf"):
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(data))
        return "\n".join(page.extract_text() or "" for page in reader.pages)

    if name.endswith(".docx"):
        from docx import Document
        doc = Document(io.BytesIO(data))
        parts = [p.text for p in doc.paragraphs]
        for table in doc.tables:                       # include table text too
            for row in table.rows:
                parts.append(" | ".join(cell.text for cell in row.cells))
        return "\n".join(parts)

    raise ValueError(f"Unsupported file type. Use one of: {', '.join(SUPPORTED)}")


def split_into_chunks(text: str, chunk_size: int = 800, overlap: int = 150) -> list[str]:
    """
    Split text into pieces of about `chunk_size` characters.
    Each chunk repeats the last `overlap` characters of the previous one,
    so a sentence cut at the edge is still found in the next chunk.
    """
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    if not text:
        return []

    # Keep paragraphs together where possible
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks: list[str] = []
    current = ""

    for para in paragraphs:
        # A very long paragraph is cut into fixed-size pieces
        while len(para) > chunk_size:
            if current:
                chunks.append(current)
                current = ""
            chunks.append(para[:chunk_size])
            para = para[chunk_size - overlap:]
        if len(current) + len(para) + 2 <= chunk_size:
            current = f"{current}\n\n{para}" if current else para
        else:
            chunks.append(current)
            tail = current[-overlap:] if overlap else ""
            current = f"{tail}\n\n{para}" if tail else para

    if current:
        chunks.append(current)
    return chunks
