from db import get_connection


def get_schema():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
    """)

    tables = cur.fetchall()

    schema_text = "Database Schema\n\n"

    for table in tables:

        table_name = table[0]

        schema_text += f"Table: {table_name}\n"

        cur.execute("""
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = %s
        """, (table_name,))

        columns = cur.fetchall()

        for column_name, data_type in columns:
            schema_text += f"- {column_name} ({data_type})\n"

        schema_text += "\n"

    cur.close()
    conn.close()

    return schema_text
    """Request and response shapes. They match what the website (chat.tsx) expects."""

from typing import Any, Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


class TableResult(BaseModel):
    columns: list[str]
    rows: list[list[Any]]


class ChatResponse(BaseModel):
    answer: str
    result: Optional[TableResult] = None
    show_table: bool = False
