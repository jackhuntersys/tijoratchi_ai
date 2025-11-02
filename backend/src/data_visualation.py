import os
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

UPLOAD_FOLDER = "data"
PLOT_FOLDER = "plots"

os.makedirs(PLOT_FOLDER, exist_ok=True)

def load_latest_file():
    """Loads the most recently uploaded data file."""
    files = [os.path.join(UPLOAD_FOLDER, f) for f in os.listdir(UPLOAD_FOLDER)]
    if not files:
        raise FileNotFoundError("No uploaded dataset found.")
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


def generate_plot(plot_type="histogram", x=None, y=None):
    """Generates and saves a plot based on the latest dataset."""
    df, file_name = load_latest_file()
    df_numeric = df.select_dtypes(include=["number"])

    if df_numeric.empty:
        raise ValueError("No numeric columns in dataset to plot.")

    plt.figure(figsize=(6, 4))
    plot_path = os.path.join(PLOT_FOLDER, f"{plot_type}.png")

    if plot_type == "histogram":
        sns.histplot(df_numeric[x] if x else df_numeric.iloc[:, 0], kde=True)
    elif plot_type == "scatter" and x and y:
        sns.scatterplot(data=df_numeric, x=x, y=y)
    elif plot_type == "box":
        sns.boxplot(data=df_numeric)
    elif plot_type == "heatmap":
        sns.heatmap(df_numeric.corr(), annot=True, cmap="coolwarm")
    else:
        raise ValueError("Invalid plot type or missing parameters.")

    plt.title(f"{plot_type.capitalize()} Plot")
    plt.tight_layout()
    plt.savefig(plot_path)
    plt.close()

    return plot_path, file_name
