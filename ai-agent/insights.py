def generate_insights(df):
    insights = []

    # Example: Age insight
    if "Age" in df.columns:
        avg_age = df["Age"].mean()
        insights.append(f"Average age of dataset is {round(avg_age, 2)}")

    # Example: Categorical insight
    for col in df.select_dtypes(include=["object"]).columns:
        top = df[col].mode()[0]
        insights.append(f"Most common value in {col} is '{top}'")

    # Example: numeric spread
    for col in df.select_dtypes(include=["number"]).columns:
        insights.append(
            f"{col} ranges from {df[col].min()} to {df[col].max()}"
        )

    return insights