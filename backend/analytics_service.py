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
    window: int = 8,
) -> dict:
    """
    Returns exactly `window` weeks of sales data.
    If early in the year, backfills from previous year.
    Missing store data is replaced by network average.
    """

    trajectory_weeks = []
    store_sales = []
    network_avg_sales = []

    current_year = year
    current_week = week

    while len(trajectory_weeks) < window:
        # Handle year rollover
        if current_week <= 0:
            current_year -= 1
            current_week = 52

        # Network average (always exists if data is present)
        network_avg = df[
            (df["Year"] == current_year) &
            (df["Week"] == current_week)
        ]["net_sales"].mean()

        # Store-specific value (may be missing)
        store_row = df[
            (df["Store Name"] == store) &
            (df["Year"] == current_year) &
            (df["Week"] == current_week)
        ]

        if not store_row.empty:
            store_value = float(store_row.iloc[0]["net_sales"])
        else:
            # Fallback to network average
            store_value = float(network_avg)

        trajectory_weeks.insert(0, current_week)
        store_sales.insert(0, store_value)
        network_avg_sales.insert(0, float(network_avg))

        current_week -= 1

    return {
        "weeks": trajectory_weeks,
        "store_sales": store_sales,
        "network_avg_sales": network_avg_sales,
    }
