import os
import pandas as pd
import numpy as np
from flask import Blueprint, request, jsonify
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier, XGBRegressor



UPLOAD_FOLDER = "data"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def load_latest_file():
    files = [os.path.join(UPLOAD_FOLDER, f) for f in os.listdir(UPLOAD_FOLDER)]
    if not files:
        raise FileNotFoundError("No uploaded dataset found.")
    latest = max(files, key=os.path.getctime)
    ext = os.path.splitext(latest)[1].lower()

    if ext == ".csv":
        df = pd.read_csv(latest)
    elif ext in [".xls", ".xlsx"]:
        df = pd.read_excel(latest)
    elif ext == ".json":
        df = pd.read_json(latest)
    else:
        raise ValueError("Unsupported file type.")
    return df

def detect_task_type(y: pd.Series):
    """Detect if the task is classification or regression"""
    if y.dtype == "object" or y.nunique() < 20:
        return "classification"
    else:
        return "regression"

def train_xgboost(learning_rate=None, max_depth=None, n_estimators=None):

    df = load_latest_file().dropna()
    df = df.ffill()

    for col in df.select_dtypes(include=['object']).columns:
        df[col] = LabelEncoder().fit_transform(df[col])

    target_col = df.columns[-1]
    X = df.iloc[:, :-1]#.select_dtypes(include=[np.number])
    y = df[target_col]

    if X.empty:
        raise ValueError("No numeric features available for training.")

    task = detect_task_type(y)
    print("Detected task type:", task)

    # Set default hyperparameters if not provided
    if task == "classification":
        learning_rate = learning_rate or 0.1
        max_depth = max_depth or 6
        n_estimators = n_estimators or 100
        model = XGBClassifier(
            learning_rate=learning_rate,
            max_depth=max_depth,
            n_estimators=n_estimators,
            use_label_encoder=False,
            eval_metric="logloss"
        ) # type: ignore
    else:
        learning_rate = learning_rate or 0.05
        max_depth = max_depth or 4
        n_estimators = n_estimators or 200
        model = XGBRegressor(
            learning_rate=learning_rate,
            max_depth=max_depth,
            n_estimators=n_estimators
        ) # type: ignore

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    # Metrics
    if task == "classification":
        acc = float(accuracy_score(y_test, np.round(y_pred)))
        r2 = None
    else:
        acc = None
        r2 = float(r2_score(y_test, y_pred))

    # Feature importance
    feature_importance = [
        {"feature": f, "importance": round(float(imp), 3)} 
        for f, imp in zip(X.columns, model.feature_importances_)
    ]

    # Sample predictions
    predictions = [
        {"actual": float(a), "predicted": float(p)}
        for a, p in zip(y_test[:10], y_pred[:10])
    ]

    return {
        "task": task,
        "accuracy": acc,
        "r2Score": r2,
        "featureImportance": feature_importance,
        "predictions": predictions,
        "learningRate": learning_rate,
        "maxDepth": max_depth,
        "nEstimators": n_estimators
    }
