"""
Simple in-memory data store with sample data.

In the real project, replace these with Supabase/Postgres queries
(keep Row Level Security on).
"""

from .models import Chunk, Document, Transaction, User

USERS: dict[str, User] = {}
TRANSACTIONS: list[Transaction] = []
DOCUMENTS: dict[str, Document] = {}
CHUNKS: list[Chunk] = []


# --- Documents (RAG) --------------------------------------------------------
def save_document(doc: Document, chunks: list[Chunk]) -> None:
    DOCUMENTS[doc.id] = doc
    CHUNKS.extend(chunks)


def get_user_documents(user_id: str) -> list[Document]:
    return [d for d in DOCUMENTS.values() if d.user_id == user_id]


def get_user_chunks(user_id: str, document_id: str | None = None) -> list[Chunk]:
    """Only ever returns the user's own chunks (keeps documents private)."""
    return [c for c in CHUNKS
            if c.user_id == user_id and (document_id is None or c.document_id == document_id)]


def delete_document(user_id: str, document_id: str) -> bool:
    doc = DOCUMENTS.get(document_id)
    if not doc or doc.user_id != user_id:
        return False
    del DOCUMENTS[document_id]
    CHUNKS[:] = [c for c in CHUNKS if c.document_id != document_id]
    return True


def get_user_transactions(user_id: str) -> list[Transaction]:
    return [t for t in TRANSACTIONS if t.user_id == user_id]


def delete_user_data(user_id: str) -> None:
    """Remove a user's transactions and documents (used when an admin deletes a user)."""
    TRANSACTIONS[:] = [t for t in TRANSACTIONS if t.user_id != user_id]
    for doc in get_user_documents(user_id):
        delete_document(user_id, doc.id)


def seed() -> None:
    """Add sample users and transactions so the API can be tested right away."""
    USERS["admin1"] = User(id="admin1", name="Admin", email="admin@cortexflow.app", role="admin")
    USERS["u1"] = User(id="u1", name="Ali", email="ali@example.com")
    rows = [
        ("2026-08-01", 90000, "income", "Salary"), ("2026-08-05", 30000, "expense", "Rent"),
        ("2026-08-10", 15000, "expense", "Food"), ("2026-08-20", 5000, "expense", "Transport"),
        ("2026-09-01", 90000, "income", "Salary"), ("2026-09-05", 30000, "expense", "Rent"),
        ("2026-09-12", 25000, "expense", "Food"), ("2026-09-22", 9000, "expense", "Shopping"),
    ]
    for d, amt, typ, cat in rows:
        TRANSACTIONS.append(Transaction(user_id="u1", date=d, amount=amt, type=typ, category=cat))
