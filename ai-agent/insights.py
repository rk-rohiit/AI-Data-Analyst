def generate_insights(df):
    insights = []

    # 1. Overview
    insights.append(f"Overview: Dataset has {len(df)} rows and {len(df.columns)} columns.")

    # 2. Outliers
    numeric_cols = df.select_dtypes(include=["number"]).columns
    for col in numeric_cols:
        series = df[col].dropna()
        if series.empty:
            continue
        q1 = series.quantile(0.25)
        q3 = series.quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        outliers = series[(series < lower_bound) | (series > upper_bound)]
        if len(outliers) > 0:
            insights.append(
                f"Outliers: Column '{col}' has {len(outliers)} outlier value(s) "
                f"(min: {outliers.min()}, max: {outliers.max()}) falling outside standard statistical boundaries."
            )

    # 3. Skewness
    for col in numeric_cols:
        series = df[col].dropna()
        if len(series) > 2:
            skew = series.skew()
            if abs(skew) >= 1.0:
                direction = "right-skewed (positive skew)" if skew > 0 else "left-skewed (negative skew)"
                insights.append(
                    f"Skewness: Variable '{col}' shows a highly {direction} distribution "
                    f"(skewness = {round(skew, 2)})."
                )

    # 4. Correlation
    if len(numeric_cols) >= 2:
        corr_matrix = df[list(numeric_cols)].corr()
        checked = set()
        for c1 in numeric_cols:
            for c2 in numeric_cols:
                if c1 == c2 or (c2, c1) in checked:
                    continue
                checked.add((c1, c2))
                r = corr_matrix.loc[c1, c2]
                if abs(r) >= 0.45:
                    strength = "strong" if abs(r) >= 0.7 else "moderate"
                    direction = "positive" if r > 0 else "negative"
                    insights.append(
                        f"Correlation: There is a {strength} {direction} correlation "
                        f"(r = {round(r, 2)}) between '{c1}' and '{c2}'."
                    )

    # 5. Dominance
    cat_cols = df.select_dtypes(include=["object"]).columns
    for col in cat_cols:
        series = df[col].dropna()
        if series.empty:
            continue
        counts = series.value_counts()
        top_val = counts.index[0]
        top_freq = counts.values[0]
        pct = (top_freq / len(series)) * 100
        if pct >= 50.0:
            insights.append(
                f"Dominance: '{top_val}' is the dominant category in '{col}', "
                f"accounting for {round(pct, 1)}% of all entries."
            )

    # Fallback if list is short
    if len(insights) <= 1:
        for col in cat_cols:
            top = df[col].mode()[0] if not df[col].mode().empty else "Unknown"
            insights.append(f"Summary: Most common category in '{col}' is '{top}'.")

    return insights