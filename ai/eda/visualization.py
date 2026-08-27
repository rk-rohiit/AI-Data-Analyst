import numpy as np
import pandas as pd

def detect_datetime_columns(df):
    """
    Attempts to detect date/time columns that are stored as strings.
    """
    dt_cols = []
    # Check string/object columns
    for col in df.select_dtypes(include=["object"]).columns:
        series = df[col].dropna()
        if series.empty:
            continue
        try:
            # Check a sample of up to 100 values to avoid slow execution
            sample_series = series.head(100)
            converted = pd.to_datetime(sample_series, errors='coerce')
            valid_pct = converted.notnull().sum() / len(sample_series)
            if valid_pct >= 0.8:
                dt_cols.append(col)
        except:
            pass
    return dt_cols

def generate_charts(df):
    charts = {}

    # Detect Date columns
    dt_cols = detect_datetime_columns(df)
    
    # Numeric columns
    numeric_cols = df.select_dtypes(include=["number"]).columns

    # 1. Numeric Distributions (Histogram & Box Plot data)
    for col in numeric_cols:
        series = df[col].dropna()
        if series.empty:
            continue
        
        # Five-number summary for Box Plot
        q1 = float(series.quantile(0.25))
        q2 = float(series.quantile(0.50))
        q3 = float(series.quantile(0.75))
        min_val = float(series.min())
        max_val = float(series.max())
        
        boxplot_data = {
            "min": min_val,
            "q1": q1,
            "median": q2,
            "q3": q3,
            "max": max_val
        }

        # Histogram data binning
        if series.nunique() <= 1:
            val = series.iloc[0] if not series.empty else 0
            charts[col] = {
                "type": "histogram",
                "title": f"Distribution of {col}",
                "x_label": col,
                "y_label": "Frequency",
                "labels": [str(val)],
                "values": [len(series)],
                "boxplot": boxplot_data
            }
            continue

        counts, bin_edges = np.histogram(series, bins=10)
        labels = []
        for i in range(len(counts)):
            left = round(float(bin_edges[i]), 2)
            right = round(float(bin_edges[i+1]), 2)
            labels.append(f"{left} - {right}")

        charts[col] = {
            "type": "histogram",
            "title": f"Distribution of {col}",
            "x_label": col,
            "y_label": "Frequency",
            "labels": labels,
            "values": counts.tolist(),
            "boxplot": boxplot_data
        }

    # 2. Categorical Columns (Bar & Pie data)
    cat_cols = [c for c in df.select_dtypes(include=["object"]).columns if c not in dt_cols]
    for col in cat_cols:
        series = df[col].dropna()
        if series.empty:
            continue
        
        value_counts = series.value_counts().head(10)
        num_unique = series.nunique()
        chart_type = "pie" if 2 <= num_unique <= 6 else "bar"
        
        charts[col] = {
            "type": chart_type,
            "title": f"Breakdown of {col}",
            "x_label": col,
            "y_label": "Count",
            "labels": value_counts.index.tolist(),
            "values": value_counts.values.tolist()
        }

    # 3. Chronological Line Chart (Date + Numeric)
    if dt_cols and len(numeric_cols) > 0:
        date_col = dt_cols[0]
        # Choose a suitable numeric column (prefer columns that aren't ID fields)
        candidates = [c for c in numeric_cols if not c.lower().endswith("id")]
        num_col = candidates[0] if candidates else numeric_cols[0]
        
        try:
            temp_df = df[[date_col, num_col]].dropna()
            temp_df[date_col] = pd.to_datetime(temp_df[date_col], errors='coerce')
            temp_df = temp_df.dropna().sort_values(by=date_col)
            
            if len(temp_df) > 0:
                # Downsample evenly to 100 records max for chart performance
                if len(temp_df) > 100:
                    indices = np.linspace(0, len(temp_df) - 1, 100, dtype=int)
                    temp_df = temp_df.iloc[indices]
                
                line_data = []
                for _, row in temp_df.iterrows():
                    # Format timestamp cleanly
                    ts = row[date_col]
                    date_str = ts.strftime('%Y-%m-%d') if isinstance(ts, pd.Timestamp) else str(ts)
                    line_data.append({
                        "x": date_str,
                        "y": float(row[num_col])
                    })
                
                charts["_line"] = {
                    "type": "line",
                    "title": f"Chronological Trend: {num_col} over {date_col}",
                    "x_axis": date_col,
                    "y_axis": num_col,
                    "data": line_data
                }
        except:
            pass

    # 4. Scatter Plot (Numeric + Numeric)
    if len(numeric_cols) >= 2:
        scatter_df = df[list(numeric_cols)].dropna()
        if len(scatter_df) > 200:
            scatter_df = scatter_df.sample(n=200, random_state=42)
        
        charts["_scatter"] = {
            "type": "scatter",
            "title": f"Relationship: {numeric_cols[0]} vs {numeric_cols[1]}",
            "columns": list(numeric_cols),
            "data": scatter_df.to_dict(orient="records")
        }

    # 5. Correlation Heatmap (Multiple Numeric Variables)
    if len(numeric_cols) >= 2:
        corr_matrix = df[list(numeric_cols)].corr().fillna(0)
        charts["_correlation"] = {
            "type": "correlation",
            "title": "Pearson Correlation Heatmap",
            "columns": list(numeric_cols),
            "matrix": corr_matrix.to_dict()
        }

    return charts
