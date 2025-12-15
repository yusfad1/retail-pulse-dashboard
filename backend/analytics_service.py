from typing import Dict, List
import pandas as pd


def compute_regional_performance(
    df: pd.DataFrame, store: str, year: int, week: int
) -> dict:
    week_df = df[(df["Year"] == year) & (df["Week"] == week)]

    store_row = week_df[week_df["Store Name"] == store].iloc[0]

    store_sales = float(store_row["net_sales"])
    network_avg = float(week_df["net_sales"].mean())

    ranked = week_df.sort_values("net_sales", ascending=False).reset_index(drop=True)
    rank = int(ranked[ranked["Store Name"] == store].index[0] + 1)

    return {
        "store_net_sales": store_sales,
        "network_avg_net_sales": network_avg,
        "gap_pct": (store_sales - network_avg) / network_avg,
        "rank": rank,
        "store_count": len(week_df),
    }


def compute_sales_trajectory(
    df: pd.DataFrame,
    store: str,
    year: int,
    week: int,
    window: int = 8
) -> Dict[str, List]:
    """
    Compute the sales trajectory for a store over the last `window`
    available weeks, rolling across year boundaries if needed.

    - Uses only REAL available data
    - Rolls back into previous years automatically
    - Returns fewer points if history is limited
    - Formats weeks as strings: "{year}-w{week}"
    """

    # Ensure proper chronological ordering
    df_sorted = df.sort_values(["Year", "Week"])

    # Filter store history up to the selected (year, week)
    store_history = df_sorted[
        (df_sorted["Store Name"] == store)
        & (
            (df_sorted["Year"] < year)
            | ((df_sorted["Year"] == year) & (df_sorted["Week"] <= week))
        )
    ]

    # Take the last available weeks (may be < window)
    recent_store = store_history.tail(window)

    years = recent_store["Year"].astype(int).tolist()
    weeks = recent_store["Week"].astype(int).tolist()
    store_sales = recent_store["net_sales"].astype(float).tolist()

    # Build formatted week labels
    week_labels = [f"{y}-w{w}" for y, w in zip(years, weeks)]

    # Compute network average for each (year, week)
    network_avg_sales = []
    for y, w in zip(years, weeks):
        avg_sales = df_sorted[
            (df_sorted["Year"] == y) & (df_sorted["Week"] == w)
        ]["net_sales"].mean()

        network_avg_sales.append(float(avg_sales))

    return {
        "weeks": week_labels,
        "store_sales": store_sales,
        "network_avg_sales": network_avg_sales,
        "is_partial": len(week_labels) < window
    }
