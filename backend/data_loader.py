import pandas as pd
from pathlib import Path

DATA_PATH = Path(__file__).parent / "data" / "practical-test-dataset-weekly-kpi.xlsx"

def load_data() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Data file not found: {DATA_PATH}")

    df = pd.read_excel(DATA_PATH)

    return df
