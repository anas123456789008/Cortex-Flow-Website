from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from llm import (
    generate_sql,
    generate_answer,
    classify_question,
    general_chat,
    financial_chat,
    answer_all_documents,
    financial_ai_summary
)

from financial_insights import financial_advice
from validator import validate_sql
from db import get_connection

from fastapi import UploadFile, File
import pandas as pd
import os
import re
from psycopg2 import sql as psql

from csv_upload import read_csv, infer_sql_type 
from file_processor import (
    extract_pdf_text,
    extract_docx_text,
    extract_txt_text
)
from db import execute_sql, insert_many
from llm import financial_ai_summary
from llm import (
    is_financial_document,
    extract_transactions
)

from db import insert_transactions

import json

app = FastAPI()

# Wildcard origins + allow_credentials=True is invalid per the CORS spec
# (browsers reject it outright), so list the actual frontend origin(s).
# Override with a comma-separated ALLOWED_ORIGINS env var in production.
allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:8080,http://127.0.0.1:8080"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def run_query(sql):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(sql)
    rows = cur.fetchall()

    colnames = [desc[0] for desc in cur.description]

    cur.close()
    conn.close()

    return {
        "columns": colnames,
        "rows": rows
    }


@app.post("/chat")
def chat(data: dict):

    try:
        question = data["message"]

        question_type = classify_question(question)

        # GENERAL CHAT
        if question_type == "GENERAL":

            answer = general_chat(question)

            return {
                "answer": answer,
                "show_table": False,
                "result": None
            }

        # DOCUMENT QA
        elif question_type == "DOCUMENT":

            answer = answer_all_documents(question)

            return {
                "answer": answer,
                "show_table": False,
                "result": None
            }

        # FINANCIAL AI
        elif question_type == "FINANCIAL":

            answer = financial_chat(question)

            return {
                "answer": answer,
                "show_table": False,
                "result": None
            }

        # DATABASE
        else:

            sql = generate_sql(question)

            sql = validate_sql(sql)

            result = run_query(sql)

            answer = generate_answer(question, result)

            show_table = any(
                word in question.lower()
                for word in ["show", "list", "display", "table"]
            )

            return {
                "answer": answer,
                "show_table": show_table,
                "result": result
            }

    except Exception as e:

        return {
            "error": str(e)
        }

@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):

    try:
        uploads_dir = "uploads"
        os.makedirs(uploads_dir, exist_ok=True)

        file_path = os.path.join(uploads_dir, file.filename)

        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        df = read_csv(file_path)

        # Sanitize the table/column names derived from user-controlled input
        # (filename, CSV headers) before they touch raw SQL. Table/column
        # names can't be parameterized like values, so we restrict them to a
        # safe character set and additionally let psycopg2.sql.Identifier
        # quote them properly.
        def safe_identifier(name: str) -> str:
            name = re.sub(r"[^a-zA-Z0-9_]", "_", str(name)).lower()
            if not name or not (name[0].isalpha() or name[0] == "_"):
                name = f"t_{name}"
            return name

        table_name = safe_identifier(os.path.splitext(file.filename)[0])
        safe_columns = [safe_identifier(col) for col in df.columns]

        column_defs = [
            psql.SQL("{} {}").format(
                psql.Identifier(col),
                psql.SQL(infer_sql_type(df[orig_col].dtype)),
            )
            for col, orig_col in zip(safe_columns, df.columns)
        ]

        create_table_sql = psql.SQL(
            "CREATE TABLE IF NOT EXISTS {table} ({fields});"
        ).format(
            table=psql.Identifier(table_name),
            fields=psql.SQL(", ").join(column_defs),
        )

        execute_sql(create_table_sql)

        execute_sql(
            """
            INSERT INTO uploaded_datasets
            (table_name, original_file_name)
            VALUES (%s, %s)
            """,
            (table_name, file.filename),
        )

        placeholders = psql.SQL(",").join([psql.Placeholder()] * len(safe_columns))

        insert_sql = psql.SQL("INSERT INTO {table} ({fields}) VALUES ({values})").format(
            table=psql.Identifier(table_name),
            fields=psql.SQL(",").join(psql.Identifier(c) for c in safe_columns),
            values=placeholders,
        )

        values = [tuple(row) for row in df.values]

        insert_many(insert_sql, values)

        return {
            "status": "success",
            "table": table_name,
            "rows_uploaded": len(df)
        }

    except Exception as e:
        return {"error": str(e)}


@app.post("/upload-file")
async def upload_file(
    file: UploadFile = File(...)
):

    try:

        uploads_dir = "uploads"

        os.makedirs(
            uploads_dir,
            exist_ok=True
        )

        file_path = os.path.join(
            uploads_dir,
            file.filename
        )

        with open(file_path, "wb") as buffer:

            buffer.write(
                await file.read()
            )

        extension = (
            file.filename
            .split(".")[-1]
            .lower()
        )

        content = ""

        if extension == "pdf":

            content = extract_pdf_text(
                file_path
            )

        elif extension == "docx":

            content = extract_docx_text(
                file_path
            )

        elif extension == "txt":

            content = extract_txt_text(
                file_path
            )

        else:

            return {
                "error": "Unsupported file type"
            }

        transactions_count = 0

        financial = is_financial_document(
            content
        )

        if financial == "YES":

            transactions_json = extract_transactions(
                content
            )

            transactions_json = (
                transactions_json
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

            transactions = json.loads(
                transactions_json
            )

            transactions_count = len(
                transactions
            )

            insert_transactions(
                transactions
            )

        conn = get_connection()

        cur = conn.cursor()

        cur.execute(
            """
            INSERT INTO uploaded_files
            (
                file_name,
                file_type,
                content
            )
            VALUES
            (%s,%s,%s)
            """,
            (
                file.filename,
                extension,
                content
            )
        )

        conn.commit()

        cur.close()
        conn.close()

        return {

            "status": "success",

            "file_name":
                file.filename,

            "file_type":
                extension,

            "transactions_imported":
                transactions_count
        }

    except Exception as e:

        return {
            "error": str(e)
        }