import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { M as Download, O as FileChartColumnIncreasing, h as Printer } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-Ddzd8qaQ.mjs";
import { r as useTransactions, t as formatCurrency } from "./finance-D95yg06q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-CbfZeX30.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const { data: txns = [] } = useTransactions();
	const r = (0, import_react.useMemo)(() => buildReport(txns), [txns]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-fade-up space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold sm:text-4xl",
				children: "Financial Report"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Monthly summary of your income, expenses and insights."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => window.print(),
				className: "inline-flex items-center gap-2 rounded-lg gradient-violet px-4 py-2.5 text-sm font-semibold text-white glow-violet",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 16 }), " Download PDF"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-glass p-8 backdrop-blur-xl print:bg-white print:text-black",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-center justify-between border-b border-border pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-lg gradient-violet",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumnIncreasing, {
								className: "text-white",
								size: 20
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-bold",
							children: "Monthly Report"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: (/* @__PURE__ */ new Date()).toLocaleDateString("en", {
								month: "long",
								year: "numeric"
							})
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {
						className: "text-muted-foreground",
						size: 18
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Income summary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Total income",
							value: formatCurrency(r.income)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Total expenses",
							value: formatCurrency(r.expenses)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Net cash flow",
							value: formatCurrency(r.savings),
							accent: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Savings rate",
							value: `${r.rate.toFixed(1)}%`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Top spending categories",
					children: r.topCats.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No data yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: r.topCats.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border bg-glass/50 px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: formatCurrency(c.value)
							})]
						}, i))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "AI summary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted-foreground",
						children: r.income === 0 && r.expenses === 0 ? "No transactions yet this period. Upload financial data to generate a meaningful report." : `This month you brought in ${formatCurrency(r.income)} and spent ${formatCurrency(r.expenses)}, for a net of ${formatCurrency(r.savings)}. Your savings rate of ${r.rate.toFixed(0)}% is ${r.rate >= 20 ? "ahead" : "behind"} the 20% benchmark. Top category was ${r.topCats[0]?.name ?? "—"}.`
					})
				})
			]
		})]
	}) });
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 last:mb-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-3 text-xs font-semibold uppercase tracking-wider text-violet",
			children: title
		}), children]
	});
}
function Row({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between border-b border-border/50 py-2 text-sm last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-mono font-semibold ${accent ? "text-emerald text-lg" : ""}`,
			children: value
		})]
	});
}
function buildReport(txns) {
	const now = /* @__PURE__ */ new Date();
	const month = txns.filter((t) => new Date(t.occurred_on).getMonth() === now.getMonth() && new Date(t.occurred_on).getFullYear() === now.getFullYear());
	const income = month.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
	const expenses = month.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
	const savings = income - expenses;
	const rate = income ? savings / income * 100 : 0;
	const catMap = /* @__PURE__ */ new Map();
	for (const t of month) if (t.type === "expense") catMap.set(t.category, (catMap.get(t.category) ?? 0) + Number(t.amount));
	return {
		income,
		expenses,
		savings,
		rate,
		topCats: [...catMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({
			name,
			value
		}))
	};
}
//#endregion
export { ReportsPage as component };
