from db import get_connection


def total_income():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT COALESCE(SUM(amount),0)
        FROM transactions
        WHERE type='credit'
    """)

    income = cur.fetchone()[0]

    cur.close()
    conn.close()

    return income


def total_spending():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT COALESCE(SUM(amount),0)
        FROM transactions
        WHERE type='debit'
    """)

    spending = cur.fetchone()[0]

    cur.close()
    conn.close()

    return spending

def savings_rate():

    income = total_income()

    spending = total_spending()

    if income == 0:
        return 0

    savings = income - spending

    return round(
        (savings / income) * 100,
        2
    )

def top_category():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT category,
               SUM(amount) as total
        FROM transactions
        WHERE type='debit'
        GROUP BY category
        ORDER BY total DESC
        LIMIT 1
    """)

    row = cur.fetchone()

    cur.close()
    conn.close()

    return row

def category_breakdown():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            category,
            SUM(amount) as total
        FROM transactions
        WHERE type='debit'
        GROUP BY category
        ORDER BY total DESC
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return rows

def category_percentages():

    categories = category_breakdown()

    total_spend = total_spending()

    results = []

    for category, amount in categories:

        percentage = round(
            (float(amount) / float(total_spend)) * 100,
            2
        )

        results.append(
            (
                category,
                amount,
                percentage
            )
        )

    return results

def monthly_spending():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            DATE_TRUNC('month', date) as month,
            SUM(amount) as total
        FROM transactions
        WHERE type='debit'
        GROUP BY month
        ORDER BY month
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return rows

def spending_trend():

    data = monthly_spending()

    if len(data) < 2:
        return "Not enough data for trend analysis."

    previous = float(data[-2][1])
    current = float(data[-1][1])

    difference = current - previous

    percent = round(
        (difference / previous) * 100,
        2
    )

    if percent > 0:

        return (
            f"Spending increased by "
            f"{percent}% compared to the previous month."
        )

    elif percent < 0:

        return (
            f"Spending decreased by "
            f"{abs(percent)}% compared to the previous month."
        )

    else:

        return "Spending remained unchanged."

def unusual_transactions():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT AVG(amount)
        FROM transactions
        WHERE type='debit'
    """)

    avg_amount = cur.fetchone()[0]

    if avg_amount is None:
        return []

    threshold = avg_amount * 2

    cur.execute("""
        SELECT
            amount,
            category,
            description,
            date
        FROM transactions
        WHERE type='debit'
        AND amount > %s
        ORDER BY amount DESC
    """, (threshold,))

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return rows

def financial_summary():

    income = total_income()

    spending = total_spending()

    savings = income - spending

    rate = savings_rate()

    category = top_category()

    return {
        "income": income,
        "spending": spending,
        "savings": savings,
        "savings_rate": rate,
        "top_category": category[0],
        "top_category_amount": category[1]
    }

def financial_advice():

    summary = financial_summary()

    income = summary["income"]
    spending = summary["spending"]
    savings = summary["savings"]
    rate = summary["savings_rate"]

    top_category = summary["top_category"]
    top_amount = summary["top_category_amount"]

    categories = category_breakdown()
    percentages = category_percentages()
    trend = spending_trend()
    anomalies = unusual_transactions()

    largest_category = percentages[0][0]
    largest_percentage = percentages[0][2]

    anomaly_text = ""

    for amount, category, description, date in anomalies:

        anomaly_text += (
            f"{category}: {amount} "
            f"({description}) "
            f"on {date}\n"
        )

    if anomaly_text == "":

        anomaly_text = "No unusual transactions detected."

    percentage_text = ""

    for category, amount, percentage in percentages:

        percentage_text += (
            f"{category}: {percentage}%\n"
        )

    category_text = ""

    for category, amount in categories:

        category_text += (
            f"{category}: {amount}\n"
        )

    if rate > 50:

        advice = """
Excellent savings performance.
You are saving more than half of your income.
"""

    elif rate > 20:

        advice = """
Healthy savings rate.
Continue monitoring expenses.
"""

    else:

        advice = """
Low savings rate.
Consider reducing discretionary spending.
"""

    concentration_message = ""

    if largest_percentage > 40:

        concentration_message = (
            f"Most spending is concentrated in "
            f"{largest_category} "
            f"({largest_percentage}%)."
        )

    return f"""
Financial Summary

Total Income:
{income}

Total Spending:
{spending}

Savings:
{savings}

Savings Rate:
{rate}%

Highest Expense Category:
{top_category}

Category Spending:
{top_amount}

Expense Breakdown:

{category_text}

Category Percentages:

{percentage_text}

Spending Trend:

{trend}

Unusual Transactions:

{anomaly_text}

Additional Insight:

{concentration_message}

Insight:
{advice}
"""
def financial_context():

    summary = financial_summary()

    categories = category_breakdown()

    percentages = category_percentages()

    trend = spending_trend()

    anomalies = unusual_transactions()

    return {
        "summary": summary,
        "categories": categories,
        "percentages": percentages,
        "trend": trend,
        "anomalies": anomalies
    }