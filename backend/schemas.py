from pydantic import BaseModel
from typing import Dict, List, Optional


class MetadataResponse(BaseModel):
    stores: List[str]
    years: List[int]
    weeks: List[int]
    
class InsightRequest(BaseModel):
    store: str
    year: int
    week: int

class KPIValue(BaseModel):
    value: float
    yoy_pct: Optional[float]
    z_vs_network: Optional[float]
    current_unusual: bool
    prior_abnormal: bool

class InsightResponse(BaseModel):
    store: str
    year: int
    week: int
    network_store_count: int
    kpis: Dict[str, KPIValue]
    ai_summary: str


class RegionalPerformanceResponse(BaseModel):
    store_net_sales: float
    network_avg_net_sales: float
    gap_pct: float
    rank: int
    store_count: int


class SalesTrajectoryResponse(BaseModel):
    weeks: List[str]
    store_sales: List[float]
    network_avg_sales: List[float]
    is_partial: bool