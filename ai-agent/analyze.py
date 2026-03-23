import sys
import pandas as pd
import json

#  get the file path from Node
file_path = sys.argv[1]

try:
    # read the CSV file
    df = pd.read_csv(file_path)
    # perform analysis (example: calculate mean of a column named 'value')
    result = {
        "rows":df.shape[0],
        "columns":df.shape[1],
        "column_names": df.columns.tolist(),
        "summary": df.describe(include='all').fillna("").to_dict()
    }
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"error": str(e)}))