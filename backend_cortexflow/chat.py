"""
Chat + upload routes used by the website's AI Chat page:

    POST /chat          {"message": "..."}  ->  {"answer", "show_table", "result"}
    POST /upload-csv    a .csv file         ->  creates a table from the CSV
    POST /upload-file   a .pdf/.docx/.txt   ->  stores the text, imports transactions

These use the older helper modules (llm.py, db.py, schema.py, ...) that import
each other by plain name (for example "from db import ..."). Adding this
folder's parent to sys.path makes those plain imports work when the app is
started as a package: uvicorn backend_cortexflow.main:app
"""

import json
import logging
import os
import re
import sys

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import pandas as pd  # noqa: E402
from fastapi import APIRouter, File, UploadFile  # noqa: E402
from psycopg2 import sql as psql  # noqa: E402

from csv_upload import infer_sql_type, read_csv  # noqa: E402
from db import (execute_sql, get_connection, insert_many,  # noqa: E402
                insert_transactions)
from file_processor import (extract_docx_text, extract_pdf_text,  # noqa: E402
                            extract_txt_text)
from llm import (answer_all_documents, classify_question,  # noqa: E402
                 extract_transactions, financial_chat, general_chat,
                 generate_answer, generate_sql, is_financial_document)
from validator import validate_sql  # noqa: E402

log = logging.getLogger("cortexflow.chat")

router = APIRouter(tags=["Chat"])

UPLOADS_DIR = os.path.join(BACKEND_DIR, "uploads")


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


def _save_upload(file: UploadFile, data: bytes) -> tuple[str, str]:
    """Save the upload inside uploads/. Returns (safe_filename, full_path)."""
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    name = os.path.basename(file.filename or "upload")  # blocks ../ tricks
    path = os.path.join(UPLOADS_DIR, name)
    with open(path, "wb") as f:
        f.write(data)
    return name, path


def _safe_identifier(name: str) -> str:
    """Table and column names cannot be parameterized, so keep them safe."""
    name = re.sub(r"[^a-zA-Z0-9_]", "_", str(name)).lower()
    if not name or not (name[0].isalpha() or name[0] == "_"):
        name = f"t_{name}"
    return name


# ---------------------------------------------------------------------------
# POST /chat
# ---------------------------------------------------------------------------
@router.post("/chat")
def chat(data: dict):
    question = str(data.get("message", "")).strip()
    if not question:
        return {"answer": "Please type a question.", "show_table": False, "result": None}

    try:
        question_type = classify_question(question)

        if question_type == "GENERAL":
            return {"answer": general_chat(question), "show_table": False, "result": None}

        if question_type == "DOCUMENT":
            return {"answer": answer_all_documents(question), "show_table": False, "result": None}

        if question_type == "FINANCIAL":
            return {"answer": financial_chat(question), "show_table": False, "result": None}

        # DATABASE question: write SQL, check it is safe, run it, explain the result
        sql = validate_sql(generate_sql(question))
        result = run_query(sql)
        answer = generate_answer(question, result)
        show_table = any(w in question.lower() for w in ["show", "list", "display", "table"])
        return {"answer": answer, "show_table": show_table, "result": result}

    except Exception as e:
        # The real error goes to the Render logs; the user sees a friendly message.
        log.exception("Chat request failed")
        return {
            "answer": f"Sorry, I could not answer that right now ({type(e).__name__}). "
                      "Please try again or rephrase your question.",
            "show_table": False,
            "result": None,
        }


# ---------------------------------------------------------------------------
# POST /upload-csv
# ---------------------------------------------------------------------------
@router.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    try:
        name, path = _save_upload(file, await file.read())
        df: pd.DataFrame = read_csv(path)

        table_name = _safe_identifier(os.path.splitext(name)[0])
        safe_columns = [_safe_identifier(c) for c in df.columns]

        column_defs = [
            psql.SQL("{} {}").format(psql.Identifier(col),
                                     psql.SQL(infer_sql_type(df[orig].dtype)))
            for col, orig in zip(safe_columns, df.columns)
        ]
        execute_sql(psql.SQL("CREATE TABLE IF NOT EXISTS {t} ({f});").format(
            t=psql.Identifier(table_name), f=psql.SQL(", ").join(column_defs)))

        execute_sql(
            "INSERT INTO uploaded_datasets (table_name, original_file_name) VALUES (%s, %s)",
            (table_name, name),
        )

        insert_sql = psql.SQL("INSERT INTO {t} ({f}) VALUES ({v})").format(
            t=psql.Identifier(table_name),
            f=psql.SQL(",").join(psql.Identifier(c) for c in safe_columns),
            v=psql.SQL(",").join([psql.Placeholder()] * len(safe_columns)),
        )
        # NaN -> None so empty CSV cells become NULL instead of failing
        clean = df.astype(object).where(pd.notnull(df), None)
        insert_many(insert_sql, [tuple(row) for row in clean.values])

        return {"status": "success", "table": table_name, "rows_uploaded": len(df)}

    except Exception as e:
        log.exception("CSV upload failed")
        return {"error": f"CSV upload failed: {type(e).__name__}: {e}"}


# ---------------------------------------------------------------------------
# POST /upload-file
# ---------------------------------------------------------------------------
@router.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    try:
        filename = os.path.basename(file.filename or "")
        extension = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
        if extension not in ("pdf", "docx", "txt"):
            return {"error": "Unsupported file type. Use PDF, DOCX, TXT or CSV."}

        name, path = _save_upload(file, await file.read())

        if extension == "pdf":
            content = extract_pdf_text(path)
        elif extension == "docx":
            content = extract_docx_text(path)
        else:
            content = extract_txt_text(path)

        # If it looks like a bank statement / bill, pull the transactions out too.
        # A failure here must not lose the upload itself.
        transactions_count = 0
        try:
            if is_financial_document(content) == "YES":
                raw = (extract_transactions(content)
                       .replace("```json", "").replace("```", "").strip())
                transactions = json.loads(raw)
                insert_transactions(transactions)
                transactions_count = len(transactions)
        except Exception:
            log.exception("Could not import transactions from %s", name)

        conn = get_connection()
        try:
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO uploaded_files (file_name, file_type, content) VALUES (%s,%s,%s)",
                (name, extension, content),
            )
            conn.commit()
            cur.close()
        finally:
            conn.close()

        return {"status": "success", "file_name": name, "file_type": extension,
                "transactions_imported": transactions_count}

    except Exception as e:
        log.exception("File upload failed")
        return {"error": f"File upload failed: {type(e).__name__}: {e}"}