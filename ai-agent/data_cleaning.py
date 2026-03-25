import pandas as pd

def clean_data(df):
    # Remove duplicate rows
    df = df.drop_duplicates()

    # Fill numeric NaN with mean
    for col in df.select_dtypes(include=["number"]).columns:
        df[col] = df[col].fillna(df[col].mean())

    # Fill categorical NaN with mode
    for col in df.select_dtypes(include=["object"]).columns:
        df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else "Unknown")

    return df