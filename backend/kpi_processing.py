from typing import Optional
import pandas as pd
import numpy as np

KPIS = ["traffic", "conversion", "units_per_tx", "avg_unit_price", "net_sales"]

def derive_kpis(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["conversion"] = df["gross_transactions"] / df["traffic"]
    df["units_per_tx"] = df["gross_quantity"] / df["gross_transactions"]
    df["avg_unit_price"] = df["net_sales"] / df["gross_quantity"]
    return df

def compute_signals(df: pd.DataFrame) -> pd.DataFrame:
    df = df.sort_values(["Store Name", "Week", "Year"])

    for kpi in KPIS:
        df[f"{kpi}_prior"] = df.groupby(["Store Name", "Week"])[kpi].shift(1)
        df[f"{kpi}_yoy_pct"] = (
            (df[kpi] - df[f"{kpi}_prior"]) / df[f"{kpi}_prior"]
        )

    net_mean = df.groupby(["Year", "Week"])[KPIS].transform("mean")
    net_std = df.groupby(["Year", "Week"])[KPIS].transform("std").replace(0, np.nan)

    for kpi in KPIS:
        z = (df[kpi] - net_mean[kpi]) / net_std[kpi]
        df[f"{kpi}_z_vs_network"] = z
        df[f"{kpi}_current_unusual"] = z.abs() > 2.0
        df[f"{kpi}_prior_abnormal"] = (
            (df[f"{kpi}_prior"] - net_mean[kpi]).abs() / net_std[kpi] > 2.0
        )

    df["network_store_count"] = df.groupby(["Year", "Week"])["Store Name"].transform("nunique")
    return df

def build_structured_context(row: pd.Series) -> dict: 
    context = { 
        "Store Name": row["Store Name"], 
        "Year": int(row["Year"]), 
        "Week": int(row["Week"]), 
        "network_store_count": int(row["network_store_count"]), 
        "kpis": {} 
    } 
    for kpi in KPIS: 
        context["kpis"][kpi] = { 
            "value": float(row[kpi]), 
            "yoy_pct": None if pd.isna(row[f"{kpi}_yoy_pct"]) else float(row[f"{kpi}_yoy_pct"]), 
            "z_vs_network": None if pd.isna(row[f"{kpi}_z_vs_network"]) else float(row[f"{kpi}_z_vs_network"]), 
            "current_unusual": bool(row[f"{kpi}_current_unusual"]), 
            "prior_abnormal": bool(row[f"{kpi}_prior_abnormal"]), 
        }
    return context

def _bucket_relative_level(z_score: Optional[float]) -> str:
    if z_score is None or pd.isna(z_score):
        return "unknown"
    if z_score >= 1.0:
        return "well_above_network"
    if z_score >= 0.3:
        return "above_network"
    if z_score <= -1.0:
        return "well_below_network"
    if z_score <= -0.3:
        return "below_network"
    return "in_line_with_network"


def _bucket_trend(yoy_pct: Optional[float]) -> str:
    if yoy_pct is None or pd.isna(yoy_pct):
        return "unknown"
    if yoy_pct >= 0.05:
        return "up"
    if yoy_pct <= -0.05:
        return "down"
    return "stable"


def sanitize_context_for_llm(row: pd.Series) -> dict:
    """
    Build a PRIVACY-SAFE structured context for LLM consumption.

    This function intentionally REMOVES:
    - Store name
    - Year / week identifiers
    - Absolute KPI values
    - Percentages and ranks

    The LLM only receives:
    - Relative performance buckets
    - Directional trends
    - Anomaly flags
    """

    safe_context = {
        "overall_performance": "unknown",
        "kpis": {}
    }

    # Build KPI-level anonymized signals
    for kpi in KPIS:
        z = row.get(f"{kpi}_z_vs_network")
        yoy = row.get(f"{kpi}_yoy_pct")

        safe_context["kpis"][kpi] = {
            "relative_level": _bucket_relative_level(z),
            "trend": _bucket_trend(yoy),
            "current_unusual": bool(row.get(f"{kpi}_current_unusual", False)),
            "prior_abnormal": bool(row.get(f"{kpi}_prior_abnormal", False)),
        }

    # Derive an overall performance signal (proxy: net_sales)
    if "net_sales" in safe_context["kpis"]:
        safe_context["overall_performance"] = (
            safe_context["kpis"]["net_sales"]["relative_level"]
        )

    return safe_context
