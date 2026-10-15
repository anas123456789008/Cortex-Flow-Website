"""FR7: System can generate personalized financial recommendations."""


def generate_recommendations(analysis: dict) -> list[dict]:
    if analysis["total_income"] == 0:
        return [{"priority": "high",
                 "message": "No income recorded yet. Add your income to get advice."}]

    recs = []
    rate = analysis["savings_rate_pct"]
    total_exp = analysis["total_expenses"]

    if rate < 10:
        recs.append({"priority": "high",
                     "message": f"Your savings rate is {rate}%. Try to save at least 20% of your income."})
    elif rate < 20:
        recs.append({"priority": "medium",
                     "message": f"Your savings rate is {rate}%. You are close to the 20% target."})
    else:
        recs.append({"priority": "low",
                     "message": f"Great job. You are saving {rate}% of your income."})

    # Flag any category using more than 30% of total spending
    for cat, amount in analysis["spending_by_category"].items():
        share = amount / total_exp * 100 if total_exp else 0
        if share > 30:
            recs.append({"priority": "medium",
                         "message": f"{cat} takes {share:.0f}% of your spending. Look for ways to reduce it."})

    change = analysis["spending_change_pct"]
    if change is not None and change > 15:
        recs.append({"priority": "high",
                     "message": f"Your spending went up {change}% compared with last month."})

    return recs
