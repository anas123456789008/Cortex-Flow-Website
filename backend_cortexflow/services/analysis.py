"""FR6: System can analyze user financial data and trends."""

from collections import defaultdict

from ..models import Transaction


def analyze_finances(transactions: list[Transaction]) -> dict:
    income = sum(t.amount for t in transactions if t.type == "income")
    expenses = sum(t.amount for t in transactions if t.type == "expense")

    by_category: dict[str, float] = defaultdict(float)
    monthly: dict[str, dict[str, float]] = defaultdict(lambda: {"income": 0.0, "expense": 0.0})

    for t in transactions:
        month = t.date.strftime("%Y-%m")
        monthly[month][t.type] += t.amount
        if t.type == "expense":
            by_category[t.category] += t.amount

    months = sorted(monthly)
    monthly_trend = [
        {
            "month": m,
            "income": round(monthly[m]["income"], 2),
            "expense": round(monthly[m]["expense"], 2),
            "savings": round(monthly[m]["income"] - monthly[m]["expense"], 2),
        }
        for m in months
    ]

    # Month-over-month change in spending (latest month vs the one before)
    spending_change_pct = None
    if len(months) >= 2:
        prev, last = monthly[months[-2]]["expense"], monthly[months[-1]]["expense"]
        if prev > 0:
            spending_change_pct = round((last - prev) / prev * 100, 1)

    savings_rate = round((income - expenses) / income * 100, 1) if income > 0 else 0.0

    return {
        "total_income": round(income, 2),
        "total_expenses": round(expenses, 2),
        "net_savings": round(income - expenses, 2),
        "savings_rate_pct": savings_rate,
        "spending_by_category": {k: round(v, 2) for k, v in
                                 sorted(by_category.items(), key=lambda x: -x[1])},
        "monthly_trend": monthly_trend,
        "spending_change_pct": spending_change_pct,
    }
