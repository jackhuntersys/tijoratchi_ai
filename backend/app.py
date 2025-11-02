from flask import Flask, request, jsonify , send_file
from flask_cors import CORS
import os
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt # type: ignore

from src.correlation_matrix import calculate_correlation
from src.data_visualation import generate_plot
from src.xgboost import train_xgboost
from src.random_forest import train_randomforest


app = Flask(__name__)
CORS(app)

# Create folder to store uploaded files
UPLOAD_FOLDER = "data"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    # Save to local folder
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Try reading metadata
    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file_path)
        elif file.filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(file_path)
        elif file.filename.endswith(".json"):
            df = pd.read_json(file_path)
        else:
            df = None

        if df is not None:
            info = {
                "rows": len(df),
                "columns": len(df.columns),
                "features": list(df.columns),
            }
        else:
            info = {"rows": 0, "columns": 0, "features": []}

        return jsonify({
            "message": f"{file.filename} saved successfully",
            "path": file_path,
            "info": info
        })
    except Exception as e:
        return jsonify({"message": "File saved but could not read data", "error": str(e)})
    



# === Correlation Matrix ===

@app.route("/correlation", methods=["GET"])
def correlation_matrix():
    try:
        corr_json, file_name = calculate_correlation()
        return jsonify({"file": file_name, "correlation": corr_json})
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500 
    

#== Data Visualization ===

@app.route("/plot", methods=["POST"])
def plot_data():
    try:
        data = request.get_json()
        plot_type = data.get("plotType", "histogram")
        x = data.get("x")
        y = data.get("y")

        plot_path, file_name = generate_plot(plot_type, x, y)

        return send_file(plot_path, mimetype="image/png")

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    

#== XGBoost Training ===

@app.route("/xgboost", methods=["POST"])
def run_xgboost():
    try:
        data = request.get_json()
        learning_rate = float(data.get("learningRate", 0.1))
        max_depth = int(data.get("maxDepth", 6))
        n_estimators = int(data.get("nEstimators", 100))

        results = train_xgboost(
            learning_rate=learning_rate,
            max_depth=max_depth,
            n_estimators=n_estimators
        )
        return jsonify({"success": True, **results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    

#== Random Forest Training ===
@app.route("/randomforest", methods=["POST"])
def run_random_forest():
    try:
        data = request.get_json()
        n_estimators = int(data.get("n_estimators", 100))
        max_depth = data.get("max_depth")
        min_samples_split = int(data.get("min_samples_split", 2))
        min_samples_leaf = int(data.get("min_samples_leaf", 1))
        max_features = data.get("max_features", "auto")

        results = train_randomforest(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            min_samples_leaf=min_samples_leaf,
            max_features=max_features
        )
        return jsonify({"success": True, **results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)


