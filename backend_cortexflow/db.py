"""PostgreSQL helpers for the Cortex Flow backend.

The structured website database uses STRUCTURED_DB_* in the v2 environment
template. DB_* remains supported for the existing backend deployment.
Never put database credentials in frontend variables.
"""
import os

import psycopg2
from dotenv import load_dotenv

load_dotenv()


def _setting(primary: str, fallback: str | None = None) -> str | None:
    value = os.getenv(primary)
    if value is None and fallback:
        value = os.getenv(fallback)
    return value.strip() if value is not None else None


def get_connection():
    """Open an SSL connection using configured structured DB credentials."""
    settings = {
        "host": _setting("STRUCTURED_DB_HOST", "DB_HOST"),
        "port": _setting("STRUCTURED_DB_PORT", "DB_PORT"),
        "dbname": _setting("STRUCTURED_DB_NAME", "DB_NAME"),
        "user": _setting("STRUCTURED_DB_USER", "DB_USER"),
        "password": _setting("STRUCTURED_DB_PASSWORD", "DB_PASSWORD"),
    }
    missing = [key for key, value in settings.items() if not value]
    if missing:
        # Do not include credential values in errors or logs.
        raise RuntimeError(
            "Missing database environment variables for: "
            + ", ".join(missing)
            + ". Configure STRUCTURED_DB_* (or legacy DB_*) in the backend environment."
        )

    try:
        settings["port"] = int(settings["port"])
    except (TypeError, ValueError) as exc:
        raise RuntimeError("STRUCTURED_DB_PORT/DB_PORT must be a valid port number.") from exc

    return psycopg2.connect(
        **settings,
        sslmode="require",
        connect_timeout=10,
    )


def execute_sql(query, params=None):
    """Execute a parameterized SQL statement and commit it."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, params)
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def insert_many(query, values):
    """Execute a parameterized statement for multiple rows."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.executemany(query, values)
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def insert_transactions(transactions, user_id=None):
    """Insert transactions for a verified Supabase user.

    The public.transactions schema requires user_id, occurred_on, description,
    category, amount and a type of 'income' or 'expense'. Callers must pass
    the user ID obtained from validated authentication, never from upload data.
    """
    if not user_id:
        raise ValueError("A verified user_id is required to insert transactions.")

    rows = []
    for tx in transactions:
        tx_type = tx.get("type")
        if tx_type not in ("income", "expense"):
            raise ValueError("Transaction type must be 'income' or 'expense'.")

        occurred_on = tx.get("occurred_on") or tx.get("date")
        if not occurred_on:
            raise ValueError("Each transaction must include occurred_on (or date).")

        rows.append((
            user_id,
            occurred_on,
            str(tx.get("description") or "Imported transaction"),
            str(tx.get("category") or "Other"),
            tx.get("amount"),
            tx_type,
        ))

    if not rows:
        return

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.executemany(
                """
                INSERT INTO public.transactions
                    (user_id, occurred_on, description, category, amount, type)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                rows,
            )
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
