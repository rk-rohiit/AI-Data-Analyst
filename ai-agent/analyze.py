import sys
import pandas as pd
import json

from data_cleaning import clean_data
from insights import generate_insights
from visualization import generate_charts

file_path = sys.argv[1]

try:
    # 📂 Load data
    df = pd.read_csv(file_path)

    # 🧹 Clean data
    df = clean_data(df)

    # 📊 Summary
    summary = df.describe(include='all').fillna("").to_dict()

    # 📋 Preview
    preview = df.head(20).to_dict(orient="records")

    # 📊 Charts
    charts = generate_charts(df)

    # 🤖 Insights
    insights = generate_insights(df)

    # 🔥 Final response
    result = {
        "rows": df.shape[0],
        "columns": df.shape[1],
        "column_names": df.columns.tolist(),
        "summary": summary,
        "preview": preview,
        "charts": charts,        # 👈 NEW
        "insights": insights     # 👈 NEW
    }

    print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": str(e)}))