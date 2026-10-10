"""FR11: System can generate AI-based financial insights and responses."""

import os


def call_llm(question: str, analysis: dict) -> str:
    """Ask Claude if ANTHROPIC_API_KEY is set; otherwise use a simple local answer."""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if api_key:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=api_key)
            msg = client.messages.create(
                model=os.getenv("CORTEXFLOW_MODEL", "claude-sonnet-4-5"),
                max_tokens=500,
                system=("You are a personal finance assistant. Use ONLY the numbers "
                        "in the data given. Answer in simple, plain English."),
                messages=[{"role": "user",
                           "content": f"Financial data: {analysis}\n\nQuestion: {question}"}],
            )
            return msg.content[0].text
        except Exception:
            pass  # fall through to the local answer

    # Fallback so the system still works without an API key
    top = next(iter(analysis["spending_by_category"].items()), None)
    text = (f"You earned {analysis['total_income']} and spent {analysis['total_expenses']}, "
            f"so you saved {analysis['net_savings']} ({analysis['savings_rate_pct']}%).")
    if top:
        text += f" Your biggest expense category is {top[0]} at {top[1]}."
    return text
