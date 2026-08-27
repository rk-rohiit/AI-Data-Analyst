import sys
import pandas as pd
import json

from preprocessor import clean_data_with_report
from eda.insights import generate_insights
from eda.visualization import generate_charts

# Ensure a file path argument was passed
if len(sys.argv) < 2:
    print(json.dumps({"error": "No file path provided"}))
    sys.exit(1)

file_path = sys.argv[1]

try:
    # 📂 Load data (automatically detect delimiter and try multiple encodings)
    encodings = ['utf-8', 'utf-8-sig', 'latin1', 'cp1252', 'utf-16']
    df = None
    last_err = None

    for encoding in encodings:
        try:
            df = pd.read_csv(file_path, sep=None, engine='python', encoding=encoding)
            break
        except Exception as e:
            last_err = e
            continue

    if df is None:
        raise Exception(f"Failed to parse file with supported encodings. Last error: {str(last_err)}")

    # Copy raw dataframe for scoring prior to cleaning
    df_raw = df.copy()

    # 🧹 Clean data and generate report
    df, cleaning_report = clean_data_with_report(df, file_path)

    # 📈 Calculate Data Quality Score
    from data_quality.quality_scorer import calculate_quality_score
    quality_score = calculate_quality_score(df_raw, cleaning_report)

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
        "charts": charts,
        "insights": insights,
        "cleaning_report": cleaning_report,
        "quality_score": quality_score
    }

    print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": str(e)}))
