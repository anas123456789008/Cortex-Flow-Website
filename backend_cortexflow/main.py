"""
CortexFlow API entry point (single file: includes the chat and upload routes).

Run locally from the project root:
    uvicorn backend_cortexflow.main:app --reload
Render start command:
    uvicorn backend_cortexflow.main:app --host 0.0.0.0 --port $PORT
"""

import json
import logging
import os
import re
import sys

# The older helper files (llm.py, db.py, schema.py, ...) import each other by
# plain name, for example "from db import ...". Adding this folder to the import
# path makes that work when the app is started as a package.
#
# "import csv" comes first on purpose: it loads Python's own csv module BEFORE
# this folder is added to the path, so a stray file named csv.py in this folder
# can never hide it (pandas needs the real one).
import csv  # noqa: E402,F401

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import pandas as pd  # noqa: E402
import psycopg2  # noqa: E402
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from google.api_core import exceptions as gexc  # noqa: E402
from psycopg2 import sql as psql  # noqa: E402

from db import (execute_sql, get_connection, insert_many,  # noqa: E402
                insert_transactions)
from file_processor import (extract_docx_text, extract_pdf_text,  # noqa: E402
                            extract_txt_text)
from llm import (answer_all_documents, classify_question,  # noqa: E402
                 extract_transactions, financial_chat, general_chat,
                 generate_answer, generate_sql, is_financial_document)
from validator import validate_sql  # noqa: E402

from .auth import current_user  # noqa: E402
from .models import User  # noqa: E402
from .routers import admin, ai, analysis, dashboard, documents, recommendations  # noqa: E402
from .store import seed  # noqa: E402

log = logging.getLogger("gemini")

app = FastAPI(title="Gemini API Key")

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
# Default origins; extra ones can be added via the CORS_ORIGINS env var
# (comma-separated), e.g. CORS_ORIGINS="https://app.mydomain.com,https://mydomain.com"
DEFAULT_ORIGINS = [
    "http://localhost:5173",   # Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    # Production + branch frontend URLs (must include https://, no trailing slash)
    "https://cortex-flow-website-2nn2.vercel.app",
    "https://cortex-flow-website-2nn2-git-main-ubi2.vercel.app",
]

# Matches ONLY this project's Vercel URLs, including preview deployments:
#   https://cortex-flow-website-2nn2.vercel.app
#   https://cortex-flow-website-2nn2-git-main-ubi2.vercel.app
#   https://cortex-flow-website-2nn2-abc123-ubi2.vercel.app
VERCEL_ORIGIN_REGEX = r"https://cortex-flow-website-2nn2(-[a-z0-9-]+)?\.vercel\.app"


def get_allowed_origins() -> list[str]:
    """
    Returns the default list, plus any extra sites set in the
    CORS_ORIGINS environment variable on Render (separated by commas).
    """
    origins = list(DEFAULT_ORIGINS)
    extra = os.getenv("CORS_ORIGINS", "")
    for item in extra.split(","):
        item = item.strip().rstrip("/")
        if item and item not in origins:
            origins.append(item)
    return origins


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_origin_regex=VERCEL_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(analysis.router)         # FR6
app.include_router(recommendations.router)  # FR7
app.include_router(ai.router)               # FR11 + FR8
app.include_router(dashboard.router)        # FR9
app.include_router(admin.router)            # FR13
app.include_router(documents.router)        # RAG: retrieve info from uploaded documents


# ---------------------------------------------------------------------------
# Basic routes
# ---------------------------------------------------------------------------
@app.get("/")
def root():
    return {"message": "CortexFlow API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Helpers for chat and uploads
# ---------------------------------------------------------------------------
UPLOADS_DIR = os.path.join(BACKEND_DIR, "uploads")


def read_csv(file_path: str) -> pd.DataFrame:
    return pd.read_csv(file_path)


def infer_sql_type(dtype) -> str:
    if "int" in str(dtype):
        return "INTEGER"
    if "float" in str(dtype):
        return "NUMERIC"
    return "TEXT"


def run_query(sql: str) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        cur.close()
    finally:
        conn.close()
    return {"columns": columns, "rows": rows}


def save_upload(file: UploadFile, data: bytes) -> tuple[str, str]:
    """Save the upload inside uploads/. Returns (safe_filename, full_path)."""
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    name = os.path.basename(file.filename or "upload")  # blocks ../ tricks
    path = os.path.join(UPLOADS_DIR, name)
    with open(path, "wb") as f:
        f.write(data)
    return name, path


def safe_identifier(name: str) -> str:
    """Table and column names cannot be parameterized, so keep them safe."""
    name = re.sub(r"[^a-zA-Z0-9_]", "_", str(name)).lower()
    if not name or not (name[0].isalpha() or name[0] == "_"):
        name = f"t_{name}"
    return name


def friendly_error(e: Exception) -> str:
    """Turn a technical error into a message the user can act on."""
    if isinstance(e, gexc.TooManyRequests):
        return ("The AI service has reached its free usage limit. "
                "Please wait about a minute and try again.")
    if isinstance(e, (gexc.ServiceUnavailable, gexc.GatewayTimeout, gexc.InternalServerError)):
        return "The AI service is busy right now. Please try again in a moment."
    if isinstance(e, (gexc.PermissionDenied, gexc.Unauthenticated, gexc.InvalidArgument)):
        return ("Google did not accept the AI key (GEMINI_API_KEY). "
                "The site owner needs to check it in Render.")
    if isinstance(e, gexc.NotFound):
        return "The AI model is not available for this key. The site owner needs to pick another model."
    if isinstance(e, psycopg2.Error):
        return "I could not reach the database right now. Please try again in a moment."
    return (f"Sorry, I could not answer that right now ({type(e).__name__}). "
            "Please try again or rephrase your question.")


# ---------------------------------------------------------------------------
# POST /chat   (used by the AI Chat page)
# ---------------------------------------------------------------------------
def get_user_financial_context(user_id: str) -> dict:
    """Return only transactions owned by the verified Supabase user."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) AS income,
                    COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS expenses,
                    COUNT(*) AS transaction_count
                FROM public.transactions
                WHERE user_id = %s
                """,
                (user_id,),
            )
            summary = cur.fetchone()

            cur.execute(
                """
                SELECT category, COALESCE(SUM(amount), 0) AS total
                FROM public.transactions
                WHERE user_id = %s AND type = 'expense'
                GROUP BY category
                ORDER BY total DESC
                LIMIT 10
                """,
                (user_id,),
            )
            categories = cur.fetchall()

            cur.execute(
                """
                SELECT occurred_on, description, category, amount, type
                FROM public.transactions
                WHERE user_id = %s
                ORDER BY occurred_on DESC, created_at DESC
                LIMIT 10
                """,
                (user_id,),
            )
            recent_transactions = cur.fetchall()

        income, expenses, transaction_count = summary
        income = float(income or 0)
        expenses = float(expenses or 0)
        return {
            "summary": {
                "income": income,
                "expenses": expenses,
                "savings": income - expenses,
                "transaction_count": transaction_count,
            },
            "expense_categories": [
                {"category": category, "total": float(total or 0)}
                for category, total in categories
            ],
            "recent_transactions": [
                {
                    "date": str(date),
                    "description": description,
                    "category": category,
                    "amount": float(amount),
                    "type": transaction_type,
                }
                for date, description, category, amount, transaction_type in recent_transactions
            ],
        }
    finally:
        conn.close()


@app.post("/chat")
def chat(data: dict, user: User = Depends(current_user)):
    question = str(data.get("message", "")).strip()
    if not question:
        return {"answer": "Please type a question.", "show_table": False, "result": None}

    try:
        question_type = classify_question(question)

        if question_type == "GENERAL":
            return {"answer": general_chat(question), "show_table": False, "result": None}

        if question_type == "FINANCIAL":
            context = get_user_financial_context(user.id)
            return {
                "answer": financial_chat(question, context=context),
                "show_table": False,
                "result": None,
            }

        if question_type == "DOCUMENT":
            # uploaded_files has no verified ownership column in the checked-in
            # migrations, so never query the legacy shared document table.
            return {
                "answer": "Document questions are temporarily unavailable while secure, user-specific document storage is configured.",
                "show_table": False,
                "result": None,
            }

        # Free-form SQL can read other users' data. Keep it disabled until
        # queries are allowlisted and every data source has ownership checks.
        return {
            "answer": "Database-wide queries are temporarily disabled while secure, user-specific data access is configured.",
            "show_table": False,
            "result": None,
        }

    except HTTPException:
        raise
    except Exception as e:
        log.exception("Chat request failed for authenticated user %s", user.id)
        return {"answer": friendly_error(e), "show_table": False, "result": None}


# ---------------------------------------------------------------------------
# POST /upload-csv
# ---------------------------------------------------------------------------
@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...), user: User = Depends(current_user)):
    # Legacy CSV uploads create globally named tables without owner metadata.
    raise HTTPException(
        status_code=503,
        detail="CSV uploads are temporarily paused until user-isolated storage is configured.",
    )


@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...), user: User = Depends(current_user)):
    # The legacy uploaded_files table has no ownership column in checked-in migrations.
    raise HTTPException(
        status_code=503,
        detail="Document uploads are temporarily paused until user-isolated storage is configured.",
    )


# ---------------------------------------------------------------------------
# Seed data
# ---------------------------------------------------------------------------
seed()  # sample data for testing; remove when using the real database


# ---------------------------------------------------------------------------
# Local run: python -m backend_cortexflow.main
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend_cortexflow.main:app", host="0.0.0.0", port=8000, reload=True)