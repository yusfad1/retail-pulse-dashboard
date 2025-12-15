from fastapi import FastAPI, HTTPException, Query, status
from data_loader import load_data
from kpi_processing import derive_kpis, compute_signals
from schemas import InsightRequest, InsightResponse, KPIValue, MetadataResponse, RegionalPerformanceResponse, SalesTrajectoryResponse
from insight_service import generate_insight
from metadata_service import extract_metadata
from analytics_service import compute_regional_performance, compute_sales_trajectory

app = FastAPI(title="Retail Pulse AI Backend")

raw_df = load_data()
df = compute_signals(derive_kpis(raw_df))

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/metadata", response_model=MetadataResponse)
def get_metadata():
    return extract_metadata(df)


@app.post("/api/insight", response_model=InsightResponse)
def get_insight(req: InsightRequest):
    match = df[
        (df["Store Name"] == req.store) &
        (df["Year"] == req.year) &
        (df["Week"] == req.week)
    ]

    if match.empty:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store/week not found")

    row = match.iloc[0]
    context, ai_text = generate_insight(row)

    return InsightResponse(
        store=req.store,
        year=req.year,
        week=req.week,
        network_store_count=context["network_store_count"],
        kpis={k: KPIValue(**v) for k, v in context["kpis"].items()},
        ai_summary=ai_text
    )


@app.get(
    "/api/regional-performance",
    response_model=RegionalPerformanceResponse,
)
def get_regional_performance(
    store: str = Query(...),
    year: int = Query(...),
    week: int = Query(...),
):
    match = df[
        (df["Store Name"] == store)
        & (df["Year"] == year)
        & (df["Week"] == week)
    ]

    if match.empty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Store/week not found",
        )

    return compute_regional_performance(df, store, year, week)


@app.get(
    "/api/sales-trajectory",
    response_model=SalesTrajectoryResponse,
)
def get_sales_trajectory(
    store: str = Query(...),
    year: int = Query(...),
    week: int = Query(...),
    window: int = Query(8, ge=4, le=16),
):
    match = df[
        (df["Store Name"] == store)
        & (df["Year"] == year)
        & (df["Week"] == week)
    ]

    if match.empty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Store/week not found",
        )

    return compute_sales_trajectory(df, store, year, week, window)