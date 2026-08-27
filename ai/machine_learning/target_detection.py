import pandas as pd

def detect_targets(df):
    """
    Scans the DataFrame columns and identifies potential targets for ML modeling.
    Returns lists of candidate target columns sorted by suitability confidence,
    along with a single default recommendation.
    """
    possible_targets = []
    
    # Exclude key terms (IDs, keys, names, emails, descriptions, dates)
    exclude_keywords = [
        'id', 'uuid', 'key', 'index', 'name', 'email', 'phone', 'url', 'address',
        'desc', 'description', 'comment', 'text', 'date', 'time', 'timestamp'
    ]
    
    # Target indicator keywords
    target_keywords = [
        'target', 'label', 'class', 'churn', 'purchased', 'status', 'price', 
        'revenue', 'salary', 'default', 'outcome', 'y', 'clicked', 'survived', 
        'diagnoses', 'admitted', 'active', 'converted', 'decision', 'target_class'
    ]
    
    for col in df.columns:
        col_lower = col.lower()
        series = df[col].dropna()
        if series.empty:
            continue
            
        unique_count = int(series.nunique())
        missing_count = int(df[col].isnull().sum())
        missing_pct = missing_count / len(df) if len(df) > 0 else 0.0
        dtype = str(df[col].dtype)
        
        # 1. Strict Filters (Cannot be targets)
        # - Constants
        if unique_count <= 1:
            continue
        # - Extreme missingness (> 50% missing values)
        if missing_pct > 0.5:
            continue
        # - Key identifiers (ending in ID or similar)
        is_id = any(col_lower.endswith(k) or col_lower == k for k in ['id', 'uuid', 'key'])
        if is_id:
            continue
        # - High cardinality non-numeric descriptions (e.g. unique names/logs)
        is_high_cardinality_text = ('object' in dtype or 'category' in dtype) and (unique_count / len(df) > 0.6)
        if is_high_cardinality_text:
            continue

        # 2. Score Suitability (Base = 50)
        score = 50
        
        # Penalty: Missing values
        score -= int(missing_pct * 40)
        
        # Boost: Target keyword indicators
        has_indicator = any(k in col_lower for k in target_keywords)
        if has_indicator:
            score += 30
            
        # Penalty: General exclusion keywords
        has_exclude = any(k in col_lower for k in exclude_keywords)
        if has_exclude:
            score -= 40
            
        # Boost/Penalty based on DataType & Cardinality
        is_categorical = ('object' in dtype or 'category' in dtype or 'bool' in dtype)
        if is_categorical:
            if 2 <= unique_count <= 10:
                score += 15
            elif unique_count > 20:
                score -= 20
        else:
            # Numeric
            if unique_count == 2:
                score += 15 # Binary encoded columns
            elif unique_count / len(df) < 0.1:
                score += 5  # Low-cardinality ordinal classes
                
        # Limit boundary between 0 and 100
        score = max(0, min(100, score))
        
        # Only suggest targets that meet a threshold confidence (e.g. 40)
        if score >= 40:
            possible_targets.append({
                "column": col,
                "dtype": dtype,
                "unique_count": unique_count,
                "missing_count": missing_count,
                "score": score,
                "is_categorical": is_categorical
            })
            
    # Sort possible targets by confidence score descending
    possible_targets.sort(key=lambda x: x["score"], reverse=True)
    
    recommended = possible_targets[0]["column"] if possible_targets else None
    
    return {
        "possible_targets": possible_targets,
        "recommended_target": recommended
    }
