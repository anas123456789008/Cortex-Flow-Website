def validate_sql(sql: str):

    sql_lower = sql.lower().strip()

    if not sql_lower.startswith("select"):
        raise Exception("Only SELECT queries allowed")

    blocked = [
        "drop",
        "delete",
        "update",
        "insert",
        "alter",
        "truncate",
        "grant",
        "revoke",
        "create"
    ]

    for word in blocked:
        if word in sql_lower:
            raise Exception(f"Blocked keyword: {word}")

    return sql