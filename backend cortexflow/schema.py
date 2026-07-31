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