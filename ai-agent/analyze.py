import sys
import pandas as pd
import json

from data_cleaning import clean_data
from insights import generate_insights
from visualization import generate_charts

file_path = sys.argv[1]

try:
    # 📂 Load data (automatically detect delimiter like tab, comma, semicolon)
    df = pd.read_csv(file_path, sep=None, engine='python')

    # 🧹 Clean data
    df = clean_data(df)

    # 📊 Summary
    desc = df.describe(include='all').fillna("").to_dict()
    null_counts = df.isnull().sum().to_dict()
    
    summary = {}
    for col in df.columns:
        summary[col] = desc.get(col, {})
        summary[col]["missing"] = int(null_counts.get(col, 0))
        summary[col]["dtype"] = str(df[col].dtype)

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