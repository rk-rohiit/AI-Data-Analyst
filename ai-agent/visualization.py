def generate_charts(df):
    charts = {}

    # Numeric columns → histogram data
    numeric_cols = df.select_dtypes(include=["number"]).columns

    for col in numeric_cols:
        charts[col] = {
            "type": "histogram",
            "values": df[col].dropna().tolist()[:100]  # limit for performance
        }

    # Categorical columns → value counts (for pie/bar)
    cat_cols = df.select_dtypes(include=["object"]).columns

    for col in cat_cols:
        value_counts = df[col].value_counts().head(10)
        charts[col] = {
            "type": "bar",
            "labels": value_counts.index.tolist(),
            "values": value_counts.values.tolist()
        }

    return charts