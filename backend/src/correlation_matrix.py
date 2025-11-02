import os
import pandas as pd

UPLOAD_FOLDER = "data"

def load_latest_file():
    """Find and load the most recently uploaded dataset."""
    files = [os.path.join(UPLOAD_FOLDER, f) for f in os.listdir(UPLOAD_FOLDER)]
    if not files:
        raise FileNotFoundError("No files uploaded yet.")
    
    latest_file = max(files, key=os.path.getctime)
    ext = os.path.splitext(latest_file)[1].lower()

    if ext == ".csv":
        df = pd.read_csv(latest_file)
    elif ext in [".xls", ".xlsx"]:
        df = pd.read_excel(latest_file)
    elif ext == ".json":
        df = pd.read_json(latest_file)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

    return df, os.path.basename(latest_file)


def calculate_correlation():
    """Compute correlation matrix for the latest uploaded file."""
    df, file_name = load_latest_file()
    corr = df.corr(numeric_only=True)
    return corr.to_dict(), file_name
