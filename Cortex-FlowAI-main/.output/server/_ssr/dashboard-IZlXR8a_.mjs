import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-j4Rv7MKA.mjs";
import { a as require_jsx_runtime, i as require_react, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as FileText, V as Activity, a as Upload, c as TrendingDown, g as PiggyBank, s as TrendingUp, u as Sparkles, z as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-Ddzd8qaQ.mjs";
import { n as useProfile, r as useTransactions, t as formatCurrency } from "./finance-D95yg06q.mjs";
import { a as YAxis, c as CartesianGrid, d as Pie, h as Tooltip, i as LineChart, m as ResponsiveContainer, n as PieChart, o as XAxis, p as Cell, s as Line } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-IZlXR8a_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORY_COLORS = [
	"#8b5cf6",
	"#22d3ee",
	"#3ddc97",
	"#fbbf24",
	"#fb7185",
	"#5b6cf2"
];
function DashboardPage() {
	const { data: profile } = useProfile();
	const { data: txns = [], isLoading } = useTransactions();
	const { data: recentDocs = [] } = useQuery({
		queryKey: ["recent-docs"],
		queryFn: async () => {
			const { data } = await supabase.from("financial_documents").select("*").order("upload_date", { ascending: false }).limit(3);
			return data ?? [];
		}
	});
	const currentMonthTxns = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
		return txns.filter((t) => new Date(t.created_at).getTime() >= startOfMonth);
	}, [txns]);
	const { kpis, monthly, categoryBreakdown } = (0, import_react.useMemo)(() => computeStats(currentMonthTxns), [currentMonthTxns]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-fade-up space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-3xl font-bold sm:text-4xl",
						children: [
							greeting(),
							", ",
							profile?.name?.split(" ")[0] ?? "there",
							" 👋"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Get insights, analyze your finances and plan a better future with AI."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/documents",
					className: "inline-flex shrink-0 items-center gap-2 rounded-lg gradient-violet px-4 py-2.5 text-sm font-semibold text-white glow-violet transition hover:-translate-y-px",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { size: 16 }), " Upload Document"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Total Income",
						amount: kpis.income,
						delta: kpis.incomeDelta,
						icon: TrendingUp,
						color: "emerald"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Total Expenses",
						amount: kpis.expenses,
						delta: kpis.expensesDelta,
						icon: TrendingDown,
						color: "rose",
						invert: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Savings",
						amount: kpis.savings,
						delta: kpis.savingsDelta,
						icon: PiggyBank,
						color: "cyan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Cash Flow",
						amount: kpis.cashflow,
						delta: kpis.cashflowDelta,
						icon: Activity,
						color: "violet"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-semibold",
							children: "Monthly Overview"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Income vs expenses, last 6 months"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md border border-border bg-glass px-3 py-1 text-xs text-muted-foreground",
							children: "Last 6 months"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: monthly,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "incGrad",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "#3ddc97",
										stopOpacity: .6
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "#3ddc97",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "rgba(255,255,255,0.06)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									stroke: "#aab0d6",
									fontSize: 11,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "#aab0d6",
									fontSize: 11,
									tickLine: false,
									axisLine: false,
									tickFormatter: (v) => `$${(v / 1e3).toFixed(0)}k`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassTooltip, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "income",
									stroke: "#3ddc97",
									strokeWidth: 2.5,
									dot: {
										r: 3,
										fill: "#3ddc97"
									},
									activeDot: { r: 5 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "expenses",
									stroke: "#fb7185",
									strokeWidth: 2.5,
									dot: {
										r: 3,
										fill: "#fb7185"
									},
									activeDot: { r: 5 }
								})
							]
						}) })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-semibold",
							children: "Expense Breakdown"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "By category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-2 h-56",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: categoryBreakdown,
								dataKey: "value",
								nameKey: "name",
								innerRadius: 55,
								outerRadius: 80,
								paddingAngle: 3,
								stroke: "none",
								children: categoryBreakdown.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassTooltip, {}) })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-xl font-bold",
									children: formatCurrency(kpis.expenses)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 space-y-1.5",
							children: categoryBreakdown.slice(0, 5).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-2 w-2 rounded-full",
										style: { background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: c.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: formatCurrency(c.value)
								})]
							}, c.name))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl border border-violet/30 bg-linear-to-br from-violet/15 via-indigo/10 to-transparent p-6 backdrop-blur-xl lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-0 top-0 h-full w-1 gradient-violet" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg gradient-violet glow-violet",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								size: 18,
								className: "text-white"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-semibold uppercase tracking-wider text-violet",
									children: "AI insight"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm leading-relaxed",
									children: generateInsight(kpis, categoryBreakdown)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/recommendations",
									className: "mt-3 inline-flex items-center gap-1 text-sm font-medium text-violet hover:gap-2 transition-all",
									children: ["View recommendations ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 14 })]
								})
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-base font-semibold",
							children: "Recent Documents"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/documents",
							className: "text-xs text-violet hover:underline",
							children: "View all"
						})]
					}), recentDocs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground",
						children: "No documents yet"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: recentDocs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 rounded-lg border border-border bg-glass/50 p-2.5 glass-hover",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
								size: 16,
								className: "text-violet"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium",
									children: d.file_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: new Date(d.upload_date).toLocaleDateString()
								})]
							})]
						}, d.id))
					})]
				})]
			}),
			isLoading && txns.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-glass p-4 text-sm text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shimmer-text",
					children: "Loading your financial data..."
				})
			})
		]
	}) });
}
function greeting() {
	const h = (/* @__PURE__ */ new Date()).getHours();
	if (h < 12) return "Good morning";
	if (h < 18) return "Good afternoon";
	return "Good evening";
}
function KpiCard({ label, amount, delta, icon: Icon, color, invert = false }) {
	const positive = invert ? delta < 0 : delta > 0;
	const colorMap = {
		emerald: "text-emerald bg-emerald/10",
		rose: "text-rose bg-rose/10",
		cyan: "text-cyan bg-cyan/10",
		violet: "text-violet bg-violet/10"
	};
	const display = useCountUp(amount);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group rounded-2xl glass p-5 glass-hover",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `grid h-10 w-10 place-items-center rounded-lg ${colorMap[color]}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `font-mono text-xs ${positive ? "text-emerald" : "text-rose"}`,
					children: [
						delta >= 0 ? "+" : "",
						delta.toFixed(1),
						"%"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 text-xs uppercase tracking-wider text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-mono text-2xl font-bold animate-count",
				children: formatCurrency(display)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: "vs last month"
			})
		]
	});
}
function useCountUp(target, duration = 900) {
	const [val, setVal] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let raf = 0;
		const start = performance.now();
		const from = 0;
		const tick = (t) => {
			const p = Math.min(1, (t - start) / duration);
			const eased = 1 - Math.pow(1 - p, 3);
			setVal(from + (target - from) * eased);
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [target, duration]);
	return val;
}
function GlassTooltip({ active, payload, label }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs backdrop-blur-xl shadow-card",
		children: [label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1 font-semibold",
			children: label
		}), payload.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-2 w-2 rounded-full",
					style: { background: p.color || p.payload.fill }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground capitalize",
					children: [p.name, ":"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono font-semibold",
					children: typeof p.value === "number" ? formatCurrency(p.value) : p.value
				})
			]
		}, i))]
	});
}
function computeStats(txns) {
	const now = /* @__PURE__ */ new Date();
	const thisMonth = now.getMonth();
	const thisYear = now.getFullYear();
	const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
	const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;
	let income = 0, expenses = 0, lastIncome = 0, lastExpenses = 0;
	const catMap = /* @__PURE__ */ new Map();
	for (const t of txns) {
		const d = new Date(t.occurred_on);
		const amt = Number(t.amount);
		if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
			if (t.type === "income") income += amt;
			else {
				expenses += amt;
				catMap.set(t.category, (catMap.get(t.category) ?? 0) + amt);
			}
		} else if (d.getMonth() === lastMonth && d.getFullYear() === lastYear) {
			if (t.type === "income") lastIncome += amt;
			else lastExpenses += amt;
		}
	}
	const savings = income - expenses;
	const lastSavings = lastIncome - lastExpenses;
	const pct = (cur, prev) => prev === 0 ? cur > 0 ? 100 : 0 : (cur - prev) / Math.abs(prev) * 100;
	const monthly = [];
	for (let i = 5; i >= 0; i--) {
		const d = new Date(thisYear, thisMonth - i, 1);
		const label = d.toLocaleDateString("en", { month: "short" });
		let mi = 0, me = 0;
		for (const t of txns) {
			const td = new Date(t.occurred_on);
			if (td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear()) {
				if (t.type === "income") mi += Number(t.amount);
				else me += Number(t.amount);
			}
		}
		monthly.push({
			month: label,
			income: mi,
			expenses: me
		});
	}
	const categoryBreakdown = Array.from(catMap.entries()).map(([name, value]) => ({
		name,
		value
	})).sort((a, b) => b.value - a.value);
	return {
		kpis: {
			income,
			expenses,
			savings,
			cashflow: savings,
			incomeDelta: pct(income, lastIncome),
			expensesDelta: pct(expenses, lastExpenses),
			savingsDelta: pct(savings, lastSavings),
			cashflowDelta: pct(savings, lastSavings)
		},
		monthly,
		categoryBreakdown
	};
}
function generateInsight(kpis, cats) {
	if (kpis.income === 0 && kpis.expenses === 0) return "Upload your first bank statement or add a few transactions to unlock AI-powered insights about your spending patterns.";
	const top = cats[0];
	const savingsRate = kpis.income > 0 ? kpis.savings / kpis.income * 100 : 0;
	if (kpis.expensesDelta > 10 && top) return `Your spending is up ${kpis.expensesDelta.toFixed(0)}% this month, driven mostly by ${top.name}. Consider setting a soft cap for that category to keep more of your income.`;
	if (savingsRate > 20) return `Strong month — you're saving ${savingsRate.toFixed(0)}% of your income. That's well above the 15% benchmark most planners recommend.`;
	return `You've spent ${formatCurrency(kpis.expenses)} so far this month. Top category is ${top?.name ?? "—"}. Ask the AI chat for a deeper breakdown.`;
}
//#endregion
export { DashboardPage as component };
