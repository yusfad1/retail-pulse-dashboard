import os
import json
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
from sambanova import SambaNova

# Load .env file from the backend directory
backend_dir = Path(__file__).parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)

openai_api_key = os.getenv("OPENAI_API_KEY")
sabanova_api_key = os.getenv("SABANOVA_API_KEY")

if openai_api_key:
    client = OpenAI(api_key=openai_api_key)
elif sabanova_api_key:
    client = SambaNova(api_key=sabanova_api_key)
else:
    raise ValueError("No valid API key found for either OpenAI or SambaNova.")


SYSTEM_PROMPT = """
You are an AI assistant generating weekly performance explanations for retail stores.

IMPORTANT PRIVACY RULES:
- You must treat all input as anonymized, non-identifiable signals
- You do NOT know store names, locations, brands, or exact figures
- You must NOT attempt to infer or reconstruct sensitive data
- You must NOT output numbers, store identifiers, or rankings

ROLE:
- Explain relative performance patterns
- Highlight unusual behaviors
- Suggest likely drivers using directional signals only

RULES:
- Use ONLY the provided categorical and boolean signals
- Do NOT invent metrics or causes
- Do NOT speculate beyond the signals
- Use cautious language (e.g. "likely", "suggests")

OUTPUT:
- 3–5 short sentences
- Business-oriented
- Neutral and trustworthy
"""



def build_user_prompt(context: dict) -> str:
    return f"""
    You are given an anonymized weekly performance summary for a retail store.

    The data contains ONLY relative and categorical signals.
    No absolute values or identifiers are included.

    ANONYMIZED CONTEXT (JSON):
    {json.dumps(context, indent=2)}

    TASK:
    Write a short weekly insight for a store manager.

    REQUIREMENTS:
    - Comment on overall performance direction
    - Highlight unusual signals when present
    - Mention YoY reliability if flagged as abnormal
    - Suggest likely drivers using relative comparisons
    - Do NOT output numbers or identifiers
    - Do NOT invent explanations not supported by the signals

    OUTPUT:
    3–5 concise sentences.
    """


def generate_ai_summary(context: dict) -> str:
    response = client.chat.completions.create(
        model=os.getenv("MODEL_NAME", "gpt-4o"),
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(context)}
        ],
        temperature=0.1,
        top_p=0.1,
    )

    return response.choices[0].message.content.strip()
