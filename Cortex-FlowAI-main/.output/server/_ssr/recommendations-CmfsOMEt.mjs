import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-j4Rv7MKA.mjs";
import { a as require_jsx_runtime, i as require_react, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { C as LoaderCircle, u as Sparkles, w as Lightbulb } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-Ddzd8qaQ.mjs";
import { r as useTransactions } from "./finance-D95yg06q.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recommendations-CmfsOMEt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RecommendationsPage() {
	const qc = useQueryClient();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { data: txns = [] } = useTransactions();
	const { data: recs = [] } = useQuery({
		queryKey: ["recommendations"],
		queryFn: async () => {
			const { data } = await supabase.from("recommendations").select("*").order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	async function generate() {
		setBusy(true);
		try {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return;
			const proposals = buildRecommendations(txns);
			if (proposals.length === 0) {
				toast.info("Add some transactions or upload data to generate recommendations.");
				return;
			}
			const { error } = await supabase.from("recommendations").insert(proposals.map((p) => ({
				...p,
				user_id: u.user.id
			})));
			if (error) throw error;
			toast.success(`Generated ${proposals.length} new recommendations`);
			qc.invalidateQueries({ queryKey: ["recommendations"] });
		} catch (e) {
			toast.error(e.message ?? "Failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-fade-up space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold sm:text-4xl",
				children: "Personalized Recommendations"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "AI-curated steps to improve your financial health."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: generate,
				disabled: busy,
				className: "inline-flex items-center gap-2 rounded-lg gradient-violet px-4 py-2.5 text-sm font-semibold text-white glow-violet disabled:opacity-50",
				children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
					size: 16,
					className: "animate-spin"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 16 }), "Generate new"]
			})]
		}), recs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid place-items-center rounded-2xl border border-dashed border-border bg-glass p-16 text-center backdrop-blur",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 grid h-12 w-12 place-items-center rounded-xl bg-violet/15",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, {
						className: "text-violet",
						size: 20
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-semibold",
					children: "No recommendations yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-sm text-sm text-muted-foreground",
					children: "Upload financial data and click \"Generate new\" to get personalized insights."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: recs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecCard, {
				rec: r,
				onApply: () => toast.success("Marked as applied")
			}, r.id))
		})]
	}) });
}
function RecCard({ rec, onApply }) {
	const priorityStyles = {
		high: "border-rose/40 bg-rose/10 text-rose",
		medium: "border-amber/40 bg-amber/10 text-amber",
		low: "border-emerald/40 bg-emerald/10 text-emerald"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl glass-hover",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${priorityStyles[rec.priority] ?? priorityStyles.medium}`,
					children: rec.priority
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: rec.category
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-lg font-semibold",
				children: rec.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted-foreground",
				children: rec.body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onApply,
				className: "mt-4 rounded-lg border border-border bg-glass px-3 py-1.5 text-xs font-medium glass-hover",
				children: "Apply this"
			})
		]
	});
}
function buildRecommendations(txns) {
	const out = [];
	if (!txns.length) return out;
	const now = /* @__PURE__ */ new Date();
	const thisMonth = txns.filter((t) => new Date(t.occurred_on).getMonth() === now.getMonth());
	const income = thisMonth.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
	const expenses = thisMonth.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
	const savings = income - expenses;
	const rate = income ? savings / income * 100 : 0;
	const catMap = /* @__PURE__ */ new Map();
	for (const t of thisMonth) if (t.type === "expense") catMap.set(t.category, (catMap.get(t.category) ?? 0) + Number(t.amount));
	const top = [...catMap.entries()].sort((a, b) => b[1] - a[1])[0];
	if (rate < 20 && income > 0) out.push({
		title: "Boost your savings rate",
		body: `You're currently saving ${rate.toFixed(0)}% of your income. Aim for at least 20% by trimming flexible spending categories.`,
		priority: "high",
		category: "Savings"
	});
	if (top && top[1] > expenses * .35) out.push({
		title: `Watch your ${top[0]} spending`,
		body: `${top[0]} accounts for over a third of your expenses this month. Setting a soft monthly cap could free up meaningful cash.`,
		priority: "medium",
		category: top[0]
	});
	out.push({
		title: "Automate the basics",
		body: "Set up automatic transfers on payday so saving happens before discretionary spending starts.",
		priority: "low",
		category: "Habits"
	});
	return out;
}
//#endregion
export { RecommendationsPage as component };
