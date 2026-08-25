import pandas as pd

def clean_data(df):
    # Strip whitespace from column names
    df.columns = df.columns.str.strip()

    # Attempt to convert object columns to numeric if >=80% of values are numbers
    for col in df.select_dtypes(include=["object"]).columns:
        # Strip whitespaces from string values without converting NaNs
        df[col] = df[col].apply(lambda x: x.strip() if isinstance(x, str) else x)
        
        # Attempt conversion to numeric
        converted = pd.to_numeric(df[col], errors='coerce')
        non_null_count = df[col].notnull().sum()
        if non_null_count > 0:
            converted_ratio = converted.notnull().sum() / non_null_count
            if converted_ratio >= 0.8:
                df[col] = converted

    # Remove duplicate rows
    df = df.drop_duplicates()

    # Fill numeric NaN with mean
    for col in df.select_dtypes(include=["number"]).columns:
        df[col] = df[col].fillna(df[col].mean())

    # Fill categorical NaN with mode
    for col in df.select_dtypes(include=["object"]).columns:
        mode_series = df[col].mode()
        df[col] = df[col].fillna(mode_series[0] if not mode_series.empty else "Unknown")

    return df
