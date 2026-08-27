import pandas as pd
import numpy as np

def calculate_quality_score(df, cleaning_report):
    """
    Computes a data quality score (0-100) based on the original dataframe
    and the data cleaning report.
    Returns a dictionary of overall score and sub-scores.
    """
    # 1. Missing Value Score
    rows_count = df.shape[0]
    cols_count = df.shape[1]
    total_cells = rows_count * cols_count
    
    if total_cells > 0:
        total_missing = int(df.isnull().sum().sum())
        missing_ratio = total_missing / total_cells
        missing_score = max(0, round(100 * (1 - missing_ratio)))
    else:
        total_missing = 0
        missing_score = 100

    # 2. Duplicate Rows Score
    if rows_count > 0:
        total_duplicates = int(df.duplicated().sum())
        duplicate_ratio = total_duplicates / rows_count
        duplicate_score = max(0, round(100 * (1 - duplicate_ratio)))
    else:
        total_duplicates = 0
        duplicate_score = 100

    # 3. Datatypes Score
    # Deductions:
    # - 10 points per suspicious column
    # - 5 points per coerced numeric column
    # - 2 points per trimmed column
    datatype_deductions = 0
    suspicious_cols = cleaning_report.get("suspicious_columns", {})
    coerced_cols = cleaning_report.get("coerced_columns", [])
    trimmed_cols = cleaning_report.get("trimmed_columns", [])
    
    datatype_deductions += 10 * len(suspicious_cols)
    datatype_deductions += 5 * len(coerced_cols)
    datatype_deductions += 2 * len(trimmed_cols)
    datatype_score = max(0, 100 - datatype_deductions)

    # 4. Outliers Score
    total_outliers = 0
    total_numeric_cells = 0
    numeric_cols = df.select_dtypes(include=['number']).columns
    
    for col in numeric_cols:
        col_data = df[col].dropna()
        if len(col_data) > 0:
            q1 = col_data.quantile(0.25)
            q3 = col_data.quantile(0.75)
            iqr = q3 - q1
            if iqr > 0:
                lower = q1 - 1.5 * iqr
                upper = q3 + 1.5 * iqr
                outliers_count = ((col_data < lower) | (col_data > upper)).sum()
                total_outliers += int(outliers_count)
            total_numeric_cells += len(col_data)
            
    if total_numeric_cells > 0:
        outlier_ratio = total_outliers / total_numeric_cells
        # If 5% outliers, score is 90; if 10% outliers, score is 80; if >=50% outliers, score is 0
        outlier_score = max(0, round(100 - (outlier_ratio * 200)))
    else:
        outlier_score = 100

    # 5. Consistency Score
    # Deductions:
    # - 25 points per empty column
    # - 15 points per constant column
    constant_cols = cleaning_report.get("constant_columns", [])
    empty_cols = cleaning_report.get("empty_columns", [])
    
    consistency_deductions = 0
    consistency_deductions += 25 * len(empty_cols)
    consistency_deductions += 15 * len(constant_cols)
    consistency_score = max(0, 100 - consistency_deductions)

    # Calculate Overall Score
    overall_score = round((missing_score + duplicate_score + datatype_score + outlier_score + consistency_score) / 5)

    # Generate Detailed Quality Warnings & Issues
    warnings = []
    
    # Missing warnings
    if total_missing > 0:
        warnings.append({
            "type": "missing",
            "severity": "medium",
            "message": f"Dataset contains {total_missing} missing cell values ({cleaning_report.get('missing_percentage', 0)}% of total data)."
        })

    # Duplicate warnings
    if total_duplicates > 0:
        warnings.append({
            "type": "duplicate",
            "severity": "medium",
            "message": f"Dataset contains {total_duplicates} duplicate records ({round(duplicate_ratio * 100, 2)}% of total rows)."
        })

    # Constant warnings
    for col in constant_cols:
        warnings.append({
            "type": "consistency",
            "severity": "medium",
            "message": f"Column '{col}' is constant (has only one unique value). Consider removing it."
        })

    # Empty warnings
    for col in empty_cols:
        warnings.append({
            "type": "consistency",
            "severity": "high",
            "message": f"Column '{col}' is completely empty (100% missing values)."
        })

    # Suspicious columns warnings
    for col, reason in suspicious_cols.items():
        warnings.append({
            "type": "datatype",
            "severity": "low",
            "message": f"Column '{col}': {reason}"
        })

    # Outlier warnings
    if total_outliers > 0 and total_numeric_cells > 0:
        if outlier_ratio > 0.05:
            warnings.append({
                "type": "outlier",
                "severity": "medium",
                "message": f"Flagged {total_outliers} outliers ({round(outlier_ratio * 100, 2)}% of numeric entries). These can distort stats and models."
            })

    # Cardinality & Imbalance warnings (Not in cleaning report, so we calculate here)
    for col in df.columns:
        if col in empty_cols:
            continue
            
        non_null = df[col].dropna()
        if len(non_null) > 0:
            # Check for high cardinality on categorical columns
            # Excluding columns with "id", "name", "key", "email", "url"
            col_lower = col.lower()
            exclude_keywords = ["id", "name", "key", "email", "url", "phone", "address"]
            is_excluded = any(kw in col_lower for kw in exclude_keywords)
            
            if df[col].dtype == "object" and not is_excluded:
                unique_count = df[col].nunique()
                unique_ratio = unique_count / len(df)
                if unique_count > 30 and unique_ratio > 0.4:
                    warnings.append({
                        "type": "cardinality",
                        "severity": "low",
                        "message": f"High cardinality detected in categorical column '{col}' ({unique_count} unique values). May be an ID or descriptive text."
                    })
                    
            # Check for extreme category dominance (class imbalance)
            if df[col].dtype == "object":
                value_counts = df[col].value_counts(normalize=True)
                if not value_counts.empty:
                    dominant_category = value_counts.index[0]
                    dominant_ratio = value_counts.iloc[0]
                    if dominant_ratio >= 0.8:
                        warnings.append({
                            "type": "imbalance",
                            "severity": "low",
                            "message": f"Class imbalance in '{col}': '{dominant_category}' represents {round(dominant_ratio * 100, 1)}% of values."
                        })

    return {
        "overall_score": overall_score,
        "missing_score": missing_score,
        "duplicate_score": duplicate_score,
        "datatype_score": datatype_score,
        "outlier_score": outlier_score,
        "consistency_score": consistency_score,
        "warnings": warnings,
        "total_outliers": total_outliers
    }
