import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler  


UPLOAD_FOLDER = "data"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def save_file(file):
    # """
    # Save uploaded file to local folder.
    # file: werkzeug FileStorage (Flask)
    # Returns saved file path.
    # """
    filename = file.filename
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    return file_path


def load_file(file_path):
    # """     Load CSV, Excel, or JSON file into a pandas DataFrame.
    
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".csv":
        df = pd.read_csv(file_path)
    elif ext in [".xls", ".xlsx"]:
        df = pd.read_excel(file_path)
    elif ext == ".json":
        df = pd.read_json(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")
    return df


def preprocess_data(df: pd.DataFrame, target_column: str = None):
   

    df = df.drop_duplicates()

    if target_column and target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' not found in dataframe")

    # Separate features and target
    if target_column:
        X = df.drop(columns=[target_column])
        y = df[target_column]
    else:
        X = df
        y = None

    # Fill missing numeric values in features
    numeric_cols = X.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        X[col].fillna(X[col].mean(), inplace=True)

    # Fill missing categorical values in features
    cat_cols = X.select_dtypes(include=[object]).columns
    for col in cat_cols:
        X[col].fillna(X[col].mode()[0], inplace=True)

    # Encode categorical features
    X_encoded = pd.get_dummies(X, drop_first=True)

    return X_encoded, y