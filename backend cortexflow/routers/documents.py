"""RAG routes: upload documents, list them, delete them, and ask questions about them."""

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from ..auth import current_user
from ..models import DocumentQuestion, User
from ..services.document_loader import SUPPORTED
from ..services.rag import answer_from_documents, ingest_document
from ..store import (DOCUMENTS, delete_document, get_user_chunks,
                     get_user_documents, save_document)

router = APIRouter(prefix="/documents", tags=["Documents (RAG)"])

MAX_FILE_MB = 10


@router.post("", status_code=201)
async def upload_document(file: UploadFile = File(...), user: User = Depends(current_user)):
    name = file.filename or "upload"
    if not name.lower().endswith(SUPPORTED):
        raise HTTPException(415, f"Unsupported file type. Use one of: {', '.join(SUPPORTED)}")

    data = await file.read()
    if len(data) > MAX_FILE_MB * 1024 * 1024:
        raise HTTPException(413, f"File is too large. Maximum is {MAX_FILE_MB} MB.")

    try:
        doc, chunks = ingest_document(user.id, name, data)
    except ValueError as e:
        raise HTTPException(422, str(e))
    except Exception:
        raise HTTPException(422, "Could not read this file. It may be damaged or password protected.")

    save_document(doc, chunks)
    return doc


@router.get("")
def list_documents(user: User = Depends(current_user)):
    return get_user_documents(user.id)


@router.delete("/{document_id}")
def remove_document(document_id: str, user: User = Depends(current_user)):
    if not delete_document(user.id, document_id):
        raise HTTPException(404, "Document not found")
    return {"deleted": document_id}


@router.post("/ask")
def ask_documents(body: DocumentQuestion, user: User = Depends(current_user)):
    if body.document_id:
        doc = DOCUMENTS.get(body.document_id)
        if not doc or doc.user_id != user.id:
            raise HTTPException(404, "Document not found")

    chunks = get_user_chunks(user.id, body.document_id)
    if not chunks:
        raise HTTPException(400, "Upload a document first.")
    return answer_from_documents(body.question, chunks, top_k=max(1, min(body.top_k, 10)))
