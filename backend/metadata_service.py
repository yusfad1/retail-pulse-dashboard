import pandas as pd
from typing import Dict, List


def extract_metadata(df: pd.DataFrame) -> Dict[str, List]:
    """
    Extract metadata needed to bootstrap the frontend UI.

    This endpoint is called once when the frontend loads
    to populate selectors (stores, years, weeks).

    Responsibilities:
    - No KPI logic
    - No LLM logic
    - No business interpretation
    """

    stores = sorted(df["Store Name"].dropna().unique().tolist())
    years = sorted(df["Year"].dropna().unique().astype(int).tolist())

    # Weeks are usually fixed (1–52), but we keep it explicit and safe
    weeks = (
        sorted(df["Week"].dropna().unique().astype(int).tolist())
        if "Week" in df.columns
        else list(range(1, 53))
    )

    return {
        "stores": stores,
        "years": years,
        "weeks": weeks
    }
