import pandas as pd
import numpy as np
import os

def clean_data_with_report(df, file_path=None):
    """
    Cleans the dataframe according to Stage 4 requirements and returns
    (df_clean, report_dict). Preserves the original file if file_path is provided.
    """
    # Track statistics before cleaning
    rows_before = int(df.shape[0])
    cols_before = int(df.shape[1])
    
    missing_before_by_col = df.isnull().sum().to_dict()
    total_missing_before = int(df.isnull().sum().sum())
    duplicates_before = int(df.duplicated().sum())
    
    # Track cleaning actions
    trimmed_columns = []
    coerced_columns = []
    constant_columns = []
    empty_columns = []
    suspicious_columns = {}
    filled_missing_summary = {}

    # 1. Trim column names
    original_cols = list(df.columns)
    df.columns = df.columns.str.strip()
    for o_col, n_col in zip(original_cols, df.columns):
        if o_col != n_col:
            trimmed_columns.append(o_col)

    df_clean = df.copy()

    # 2. Check for empty and constant columns
    for col in df_clean.columns:
        # Check if empty
        if df_clean[col].isnull().all():
            empty_columns.append(col)
            continue
            
        # Check if constant (only 1 unique value)
        if df_clean[col].nunique(dropna=True) <= 1:
            constant_columns.append(col)

    # 3. Trim string values & Auto-coerce numeric columns
    for col in df_clean.columns:
        if col in empty_columns:
            continue
            
        if df_clean[col].dtype == "object":
            # Trim string values
            # Compare before and after trim
            has_strings = df_clean[col].apply(lambda x: isinstance(x, str))
            if has_strings.any():
                trimmed_series = df_clean[col].apply(lambda x: x.strip() if isinstance(x, str) else x)
                if not (df_clean[col].dropna() == trimmed_series.dropna()).all():
                    trimmed_columns.append(col)
                df_clean[col] = trimmed_series

            # Attempt to convert to numeric if >= 80% are numeric
            non_null_series = df_clean[col].dropna()
            if len(non_null_series) > 0:
                converted = pd.to_numeric(non_null_series, errors='coerce')
                valid_num_count = converted.notnull().sum()
                valid_ratio = valid_num_count / len(non_null_series)
                
                if valid_ratio >= 0.8:
                    df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce')
                    coerced_columns.append(col)
                else:
                    # Detect suspicious datatypes: e.g. text columns containing date-like strings
                    try:
                        converted_dates = pd.to_datetime(non_null_series, errors='coerce')
                        valid_date_ratio = converted_dates.notnull().sum() / len(non_null_series)
                        if valid_date_ratio >= 0.8:
                            suspicious_columns[col] = "Looks like a date column but stored as text"
                    except Exception:
                        pass
        elif df_clean[col].dtype in ['int64', 'float64']:
            # Check for suspicious numeric values (e.g., negative ages, or columns with huge values)
            # Standard heuristic: if a column name has "age" and values < 0
            if "age" in col.lower() and (df_clean[col] < 0).any():
                suspicious_columns[col] = "Contains negative age values"

    # 4. Remove duplicate rows
    df_clean = df_clean.drop_duplicates()

    # 5. Fill missing values (preserving original separately since NaNs are filled here)
    for col in df_clean.columns:
        null_count = int(df_clean[col].isnull().sum())
        if null_count > 0:
            if df_clean[col].dtype in ['int64', 'float64']:
                mean_val = df_clean[col].mean()
                if not pd.isnull(mean_val):
                    df_clean[col] = df_clean[col].fillna(mean_val)
                    filled_missing_summary[col] = f"Filled {null_count} missing values with column mean ({float(mean_val):.2f})"
                else:
                    df_clean[col] = df_clean[col].fillna(0)
                    filled_missing_summary[col] = f"Filled {null_count} missing values with 0 (column is numeric but empty)"
            else:
                mode_series = df_clean[col].mode()
                if not mode_series.empty:
                    mode_val = mode_series[0]
                    df_clean[col] = df_clean[col].fillna(mode_val)
                    filled_missing_summary[col] = f"Filled {null_count} missing values with column mode ('{mode_val}')"
                else:
                    df_clean[col] = df_clean[col].fillna("Unknown")
                    filled_missing_summary[col] = f"Filled {null_count} missing values with 'Unknown'"

    rows_after = int(df_clean.shape[0])
    cols_after = int(df_clean.shape[1])
    
    # Preserve original dataset by saving the cleaned file separately
    cleaned_file_path = ""
    cleaned_filename = ""
    if file_path:
        try:
            dir_name = os.path.dirname(file_path)
            base_name = os.path.basename(file_path)
            cleaned_filename = "cleaned-" + base_name
            cleaned_file_path = os.path.join(dir_name, cleaned_filename)
            
            # Write out standard CSV (which can easily be read again)
            df_clean.to_csv(cleaned_file_path, index=False)
        except Exception as e:
            print(f"Error saving cleaned file: {str(e)}", file=sys.stderr)

    # 6. Build the Cleaning Report
    report = {
        "rows_before": rows_before,
        "rows_after": rows_after,
        "columns_before": cols_before,
        "columns_after": cols_after,
        "duplicates_before": duplicates_before,
        "duplicates_removed": duplicates_before,
        "total_missing_before": total_missing_before,
        "missing_percentage": round((total_missing_before / (rows_before * cols_before) * 100), 2) if (rows_before * cols_before) > 0 else 0,
        "numeric_columns_detected": int(df_clean.select_dtypes(include=['number']).shape[1]),
        "categorical_columns_detected": int(df_clean.select_dtypes(include=['object', 'category']).shape[1]),
        "trimmed_columns": list(set(trimmed_columns)), # Remove any duplicates
        "coerced_columns": coerced_columns,
        "constant_columns": constant_columns,
        "empty_columns": empty_columns,
        "suspicious_columns": suspicious_columns,
        "filled_missing_summary": filled_missing_summary,
        "cleaned_filename": cleaned_filename
    }

    return df_clean, report

def clean_data(df):
    """
    Backward-compatible wrapper function
    """
    df_clean, _ = clean_data_with_report(df)
    return df_clean
