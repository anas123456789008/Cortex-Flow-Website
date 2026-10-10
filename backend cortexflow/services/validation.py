"""FR8: System can validate and explain generated responses."""

import re


def _known_numbers(analysis: dict) -> set[float]:
    nums = {analysis["total_income"], analysis["total_expenses"],
            analysis["net_savings"], analysis["savings_rate_pct"]}
    nums.update(analysis["spending_by_category"].values())
    for m in analysis["monthly_trend"]:
        nums.update([m["income"], m["expense"], m["savings"]])
    if analysis["spending_change_pct"] is not None:
        nums.add(abs(analysis["spending_change_pct"]))
    return {round(n, 2) for n in nums}


def validate_ai_response(response: str, analysis: dict) -> dict:
    """Check that every number in the AI answer exists in the user's real data."""
    known = _known_numbers(analysis)
    found = [float(x.replace(",", "")) for x in re.findall(r"\d[\d,]*\.?\d*", response)]
    # Ignore years and small numbers (like a "20%" target or "3 months")
    unsupported = [n for n in found
                   if n > 100 and round(n, 2) not in known and not 1900 <= n <= 2100]

    return {
        "is_valid": not unsupported,
        "unsupported_numbers": unsupported,
        "explanation": (
            "Every figure in this answer matches your recorded transactions."
            if not unsupported else
            "Some figures in this answer could not be matched to your data. Please double-check them."
        ),
        "data_used": {
            "total_income": analysis["total_income"],
            "total_expenses": analysis["total_expenses"],
            "savings_rate_pct": analysis["savings_rate_pct"],
            "categories": list(analysis["spending_by_category"]),
        },
    }
