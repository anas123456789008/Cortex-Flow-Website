import pandas as pd

def read_csv(file_path):
    return pd.read_csv(file_path)

def infer_sql_type(dtype):
    if "int" in str(dtype):
        return "INTEGER"
    elif "float" in str(dtype):
        return "NUMERIC"
    else:
        return "TEXT"