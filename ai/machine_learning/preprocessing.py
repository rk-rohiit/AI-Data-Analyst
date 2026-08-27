import os
import sys
import json
import argparse
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, MinMaxScaler, OneHotEncoder, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

def run_preprocessing(filepath, target_col, feature_cols, scaling_strategy='standard', test_size=0.2, output_dir=None):
    """
    Fits and saves a scikit-learn preprocessing pipeline for numerical and categorical features,
    splits the dataset, and saves the partitioned arrays to disk.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset file not found: {filepath}")
        
    df = pd.read_csv(filepath)
    
    # 1. Validation
    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found in dataset columns.")
        
    # Check if feature columns are specified, otherwise use all columns minus target
    if not feature_cols:
        feature_cols = [col for col in df.columns if col != target_col]
    else:
        # filter out features not present in df
        feature_cols = [col for col in feature_cols if col in df.columns]
        
    if not feature_cols:
        raise ValueError("No valid features selected for preprocessing.")
        
    # 2. Extract X and y
    X = df[feature_cols].copy()
    y = df[target_col].copy()
    
    # 3. Identify numeric vs categorical columns in features
    numeric_cols = []
    categorical_cols = []
    
    for col in X.columns:
        # Check dtype
        if pd.api.types.is_numeric_dtype(X[col]) and not pd.api.types.is_bool_dtype(X[col]):
            numeric_cols.append(col)
        else:
            categorical_cols.append(col)
            
    # 4. Construct Scikit-learn Pipeline components
    # Numeric pipeline
    numeric_transformers = [
        ('imputer', SimpleImputer(strategy='mean'))
    ]
    if scaling_strategy == 'standard':
        numeric_transformers.append(('scaler', StandardScaler()))
    elif scaling_strategy == 'minmax':
        numeric_transformers.append(('scaler', MinMaxScaler()))
        
    numeric_pipeline = Pipeline(numeric_transformers)
    
    # Categorical pipeline
    categorical_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    # Bundle into ColumnTransformer
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_pipeline, numeric_cols),
            ('cat', categorical_pipeline, categorical_cols)
        ],
        remainder='drop'
    )
    
    # 5. Split train/test partition (to prevent leakage, fit preprocessor on train only)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42
    )
    
    # 6. Fit and transform features
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    # 7. Process Target Column
    # Is classification?
    is_classification = False
    y_dtype = str(y.dtype)
    unique_targets = y.dropna().unique()
    
    # Check target classification heuristics: string/categorical or low cardinality numeric
    if ('object' in y_dtype or 'category' in y_dtype or 'bool' in y_dtype or len(unique_targets) <= 10):
        is_classification = True
        
    label_encoder = None
    if is_classification:
        label_encoder = LabelEncoder()
        # Impute missing targets if any with mode before label encoding
        y_train = y_train.fillna(y_train.mode()[0] if not y_train.mode().empty else 0)
        y_test = y_test.fillna(y_train.mode()[0] if not y_train.mode().empty else 0)
        
        y_train_processed = label_encoder.fit_transform(y_train)
        y_test_processed = label_encoder.transform(y_test)
    else:
        # Numeric regression: fill missing values in target with mean
        y_train_processed = y_train.fillna(y_train.mean()).values
        y_test_processed = y_test.fillna(y_train.mean()).values
        
    # Get final preprocessed feature names
    # Numerical features names keep their names
    final_features = list(numeric_cols)
    # One-hot encoded feature names
    if categorical_cols:
        cat_encoder = preprocessor.named_transformers_['cat'].named_steps['encoder']
        encoded_names = cat_encoder.get_feature_names_out(categorical_cols)
        final_features.extend(list(encoded_names))
        
    # 8. Save artifacts using Joblib / Numpy
    if not output_dir:
        output_dir = os.path.dirname(filepath)
        
    # Create filenames based on timestamp or prefix
    base_name = os.path.splitext(os.path.basename(filepath))[0]
    
    preprocessor_filename = f"preprocessor_{base_name}.pkl"
    preprocessor_path = os.path.join(output_dir, preprocessor_filename)
    joblib.dump(preprocessor, preprocessor_path)
    
    le_filename = None
    le_path = None
    if label_encoder:
        le_filename = f"label_encoder_{base_name}.pkl"
        le_path = os.path.join(output_dir, le_filename)
        joblib.dump(label_encoder, le_path)
        
    # Save partitioned matrices
    X_train_path = os.path.join(output_dir, f"X_train_{base_name}.npy")
    X_test_path = os.path.join(output_dir, f"X_test_{base_name}.npy")
    y_train_path = os.path.join(output_dir, f"y_train_{base_name}.npy")
    y_test_path = os.path.join(output_dir, f"y_test_{base_name}.npy")
    
    np.save(X_train_path, X_train_processed)
    np.save(X_test_path, X_test_processed)
    np.save(y_train_path, y_train_processed)
    np.save(y_test_path, y_test_processed)
    
    # 9. Return execution metadata
    return {
        "success": True,
        "base_name": base_name,
        "train_shape": list(X_train_processed.shape),
        "test_shape": list(X_test_processed.shape),
        "is_classification": is_classification,
        "classes": [x.item() if hasattr(x, "item") else x for x in label_encoder.classes_] if label_encoder else None,
        "numeric_features": numeric_cols,
        "categorical_features": categorical_cols,
        "final_features": final_features,
        "preprocessor_file": preprocessor_filename,
        "label_encoder_file": le_filename,
        "files": {
            "preprocessor": preprocessor_path,
            "label_encoder": le_path,
            "X_train": X_train_path,
            "X_test": X_test_path,
            "y_train": y_train_path,
            "y_test": y_test_path
        }
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AI Preprocessing Pipeline Engine")
    parser.add_argument("--filepath", required=True, help="Path to raw CSV dataset")
    parser.add_argument("--target", required=True, help="Target column name")
    parser.add_argument("--features", default="", help="Comma-separated feature column names")
    parser.add_argument("--scaling", default="standard", choices=["standard", "minmax", "none"], help="Scaling strategy")
    parser.add_argument("--test_size", type=float, default=0.2, help="Train/test partition split ratio")
    parser.add_argument("--output_dir", default="", help="Path to output saved artifacts")
    
    args = parser.parse_args()
    
    features_list = [f.strip() for f in args.features.split(",") if f.strip()] if args.features else None
    out_dir = args.output_dir if args.output_dir else None
    
    try:
        results = run_preprocessing(
            filepath=args.filepath,
            target_col=args.target,
            feature_cols=features_list,
            scaling_strategy=args.scaling,
            test_size=args.test_size,
            output_dir=out_dir
        )
        print(json.dumps(results))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)
