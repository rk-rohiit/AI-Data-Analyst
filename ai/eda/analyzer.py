import pandas as pd
import numpy as np

def run_eda(df):
    """
    Performs automated Exploratory Data Analysis.
    Calculates detailed numeric, categorical, and dataset-level stats.
    """
    numeric_cols = list(df.select_dtypes(include=['number']).columns)
    cat_cols = list(df.select_dtypes(include=['object', 'category']).columns)
    
    # 1. Dataset-level Stats
    dataset_stats = {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "numeric_columns_count": len(numeric_cols),
        "categorical_columns_count": len(cat_cols),
        "numeric_columns": numeric_cols,
        "categorical_columns": cat_cols,
        "total_missing": int(df.isnull().sum().sum()),
        "total_duplicates": int(df.duplicated().sum())
    }
    
    # 2. Column-level Stats
    summary = {}
    for col in df.columns:
        col_data = df[col]
        missing_count = int(col_data.isnull().sum())
        missing_pct = round((missing_count / len(df) * 100), 2) if len(df) > 0 else 0.0
        
        col_summary = {
            "dtype": str(col_data.dtype),
            "missing": missing_count,
            "missing_pct": missing_pct
        }
        
        if col in numeric_cols:
            non_null = col_data.dropna()
            if len(non_null) > 0:
                # Mode(s)
                mode_series = non_null.mode()
                mode_val = float(mode_series.iloc[0]) if not mode_series.empty else ""
                
                # Standard deviation & Variance (requires at least 2 values)
                std_val = float(non_null.std()) if len(non_null) > 1 else 0.0
                var_val = float(non_null.var()) if len(non_null) > 1 else 0.0
                
                # Skewness & Kurtosis (requires at least 3 values)
                skew_val = float(non_null.skew()) if len(non_null) > 2 else 0.0
                kurt_val = float(non_null.kurt()) if len(non_null) > 2 else 0.0
                
                q1 = float(non_null.quantile(0.25))
                q2 = float(non_null.quantile(0.50))
                q3 = float(non_null.quantile(0.75))
                
                col_summary.update({
                    "mean": float(non_null.mean()),
                    "median": q2,
                    "mode": mode_val,
                    "min": float(non_null.min()),
                    "max": float(non_null.max()),
                    "std": std_val,
                    "var": var_val,
                    "q1": q1,
                    "q2": q2,
                    "q3": q3,
                    "iqr": q3 - q1,
                    "skew": skew_val,
                    "kurt": kurt_val
                })
            else:
                col_summary.update({
                    "mean": "", "median": "", "mode": "", "min": "", "max": "",
                    "std": "", "var": "", "q1": "", "q2": "", "q3": "",
                    "iqr": "", "skew": "", "kurt": ""
                })
        else:
            # Categorical
            non_null = col_data.dropna()
            if len(non_null) > 0:
                val_counts = non_null.value_counts()
                top_val = val_counts.index[0] if not val_counts.empty else "Unknown"
                top_freq = int(val_counts.iloc[0]) if not val_counts.empty else 0
                cardinality = int(non_null.nunique())
                
                # Percentage distribution (top 10 values)
                val_pcts = non_null.value_counts(normalize=True).head(10).to_dict()
                percentage_distribution = {str(k): round(float(v) * 100, 2) for k, v in val_pcts.items()}
                
                col_summary.update({
                    "unique": cardinality,
                    "top": str(top_val),
                    "freq": top_freq,
                    "cardinality": cardinality,
                    "dominant_category": str(top_val),
                    "percentage_distribution": percentage_distribution
                })
            else:
                col_summary.update({
                    "unique": 0,
                    "top": "Unknown",
                    "freq": 0,
                    "cardinality": 0,
                    "dominant_category": "Unknown",
                    "percentage_distribution": {}
                })
                
        summary[col] = col_summary
        
    return {
        "dataset": dataset_stats,
        "summary": summary
    }
