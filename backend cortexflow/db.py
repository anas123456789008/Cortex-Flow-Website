import os
import psycopg2
import json
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        sslmode="require"
    )

def execute_sql(sql, params=None):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(sql, params)

    conn.commit()

    cur.close()
    conn.close()

def insert_many(sql, values):
    conn = get_connection()
    cur = conn.cursor()

    cur.executemany(sql, values)

    conn.commit()

    cur.close()
    conn.close()

def insert_transactions(transactions):

    conn = get_connection()
    cur = conn.cursor()

    for tx in transactions:

        cur.execute("""
            INSERT INTO transactions
            (
                date,
                description,
                category,
                amount,
                type
            )
            VALUES (%s,%s,%s,%s,%s)
        """, (
            tx["date"],
            tx["description"],
            tx["category"],
            tx["amount"],
            tx["type"]
        ))

    conn.commit()

    cur.close()
    conn.close()