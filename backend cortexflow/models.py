"""Data models used across CortexFlow."""

import uuid
from datetime import date as date_type
from typing import Optional

from pydantic import BaseModel, Field


class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    date: date_type
    amount: float          # always positive
    type: str              # "income" or "expense"
    category: str = "Other"


class User(BaseModel):
    id: str
    name: str
    email: str
    role: str = "user"     # "user" or "admin"
    is_active: bool = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class AIQuestion(BaseModel):
    question: str


class Document(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    filename: str
    num_chunks: int = 0


class Chunk(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    document_id: str
    user_id: str
    filename: str
    index: int             # position of the chunk inside the document
    text: str


class DocumentQuestion(BaseModel):
    question: str
    top_k: int = 4         # how many chunks to retrieve
    document_id: Optional[str] = None   # limit the search to one document
