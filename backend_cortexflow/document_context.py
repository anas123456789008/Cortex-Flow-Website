from db import get_connection


def get_latest_document():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT file_name, content
        FROM uploaded_files
        ORDER BY id DESC
        LIMIT 1
    """)

    row = cur.fetchone()

    cur.close()
    conn.close()

    return row


def get_all_documents():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT file_name, content
        FROM uploaded_files
        ORDER BY id DESC
    """)

    docs = cur.fetchall()

    cur.close()
    conn.close()

    return docs