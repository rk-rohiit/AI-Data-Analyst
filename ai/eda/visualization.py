import numpy as np
import pandas as pd

def generate_charts(df):
    charts = {}

    # Numeric columns
    numeric_cols = df.select_dtypes(include=["number"]).columns

    for col in numeric_cols:
        series = df[col].dropna()
        if series.empty:
            continue
        
        # If all values are identical or there is only 1 unique value
        if series.nunique() <= 1:
            val = series.iloc[0] if not series.empty else 0
            charts[col] = {
                "type": "histogram",
                "labels": [str(val)],
                "values": [len(series)]
            }
            continue

        # Compute histogram using numpy
        counts, bin_edges = np.histogram(series, bins=10)
        labels = []
        for i in range(len(counts)):
            left = round(float(bin_edges[i]), 2)
            right = round(float(bin_edges[i+1]), 2)
            labels.append(f"{left} - {right}")

        charts[col] = {
            "type": "histogram",
            "labels": labels,
            "values": counts.tolist()
        }

    # Categorical columns → value counts (for pie/bar)
    cat_cols = df.select_dtypes(include=["object"]).columns

    for col in cat_cols:
        series = df[col].dropna()
        if series.empty:
            continue
        
        value_counts = series.value_counts().head(10)
        num_unique = series.nunique()
        chart_type = "pie" if 2 <= num_unique <= 6 else "bar"
        
        charts[col] = {
            "type": chart_type,
            "labels": value_counts.index.tolist(),
            "values": value_counts.values.tolist()
        }

    # Scatter plot data downsampling
    if len(numeric_cols) >= 2:
        scatter_df = df[list(numeric_cols)].dropna()
        if len(scatter_df) > 200:
            scatter_df = scatter_df.sample(n=200, random_state=42)
        charts["_scatter"] = {
            "type": "scatter",
            "columns": list(numeric_cols),
            "data": scatter_df.to_dict(orient="records")
        }

    # Correlation Matrix
    if len(numeric_cols) >= 2:
        corr_matrix = df[list(numeric_cols)].corr().fillna(0)
        charts["_correlation"] = {
            "type": "correlation",
            "columns": list(numeric_cols),
            "matrix": corr_matrix.to_dict()
        }

    return charts
