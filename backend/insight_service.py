from .kpi_processing import build_structured_context, sanitize_context_for_llm
from .llm_service import generate_ai_summary

def generate_insight(row):
    context = build_structured_context(row)
    safe_context = sanitize_context_for_llm(row)
    ai_text = generate_ai_summary(safe_context)
    return context, ai_text
