import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as Brand, t as AuroraBackground } from "./aurora-background-BZIRHeSL.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as ArrowRight, L as ChartColumn, R as Brain, d as ShieldCheck, t as Zap, u as Sparkles, v as MessageSquare } from "../_libs/lucide-react.mjs";
import { r as FaUser } from "../_libs/react-icons.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B-YCnqUV.js
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grain relative min-h-screen overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuroraBackground, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/auth",
							className: "rounded-lg gradient-violet px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 glow-violet inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaUser, { size: 18 }), "Sign In"]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-6xl px-6 pt-16 pb-20 text-center md:pt-28",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-xs font-medium text-violet backdrop-blur",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 12 }), " Powered by Text-to-SQL + RAG"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl",
							children: [
								"Turn data into ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "gradient-text",
									children: "financial wisdom"
								}),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-6 max-w-2xl text-lg text-muted-foreground",
							children: "Upload your statements, ask anything in plain English, and get clear, AI-driven insights about where your money actually goes."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex flex-wrap items-center justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/auth",
								className: "inline-flex items-center gap-2 rounded-xl gradient-violet px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 glow-violet",
								children: ["Start free ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								className: "rounded-xl border border-border bg-glass px-6 py-3 text-sm font-semibold backdrop-blur glass-hover",
								children: "See it in action"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mt-16 max-w-4xl rounded-2xl border border-border bg-glass p-2 shadow-[0_30px_80px_-30px_rgba(139,92,246,0.5)] backdrop-blur-2xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl bg-background/60 p-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-4 md:grid-cols-3",
									children: [
										{
											icon: ChartColumn,
											label: "Net cash flow",
											value: "+$4,318",
											color: "text-emerald"
										},
										{
											icon: MessageSquare,
											label: "AI insights",
											value: "12 new",
											color: "text-violet"
										},
										{
											icon: Brain,
											label: "Data points analyzed",
											value: "8,442",
											color: "text-cyan"
										}
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-border bg-glass p-4 text-left",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, {
												className: `${s.color} mb-2`,
												size: 18
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs uppercase tracking-wider text-muted-foreground",
												children: s.label
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono text-2xl font-semibold",
												children: s.value
											})
										]
									}, s.label))
								})
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mx-auto grid max-w-6xl gap-4 px-6 pb-24 md:grid-cols-3",
					children: [
						{
							icon: Brain,
							title: "Ask anything",
							body: "Plain-English questions get real answers from your financial data using Text-to-SQL."
						},
						{
							icon: ShieldCheck,
							title: "Private by default",
							body: "Your data stays yours. Encrypted in transit, isolated per account, never sold."
						},
						{
							icon: Zap,
							title: "Instant insights",
							body: "Auto-generated breakdowns of spending, savings rate, and cash flow trends."
						}
					].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-glass p-6 backdrop-blur glass-hover",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 grid h-10 w-10 place-items-center rounded-lg bg-violet/15 text-violet",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-semibold",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: f.body
							})
						]
					}, f.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border border-emerald/30 bg-emerald/5 p-5 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald/15 text-emerald",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 20 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wider text-emerald",
								children: "Security & Privacy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted-foreground",
								children: "Your data is protected with bank-level encryption, secure authentication, and automatic session management — built with Supabase security standards."
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "mt-16 border-t border-border/60 py-8 text-center text-xs text-muted-foreground",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Cortex Flow. Built by CS students at CUST, Islamabad."
					]
				})
			]
		})]
	});
}
//#endregion
export { Landing as component };
