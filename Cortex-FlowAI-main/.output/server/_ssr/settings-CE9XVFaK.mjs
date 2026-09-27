import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-j4Rv7MKA.mjs";
import { a as require_jsx_runtime, i as require_react, r as useQueryClient } from "../_libs/react+tanstack__react-query.mjs";
import { y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as LoaderCircle, m as Save, o as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-Ddzd8qaQ.mjs";
import { n as useProfile } from "./finance-D95yg06q.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CE9XVFaK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { data: profile } = useProfile();
	const qc = useQueryClient();
	const router = useRouter();
	const [name, setName] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [newPwd, setNewPwd] = (0, import_react.useState)("");
	const [notifEmail, setNotifEmail] = (0, import_react.useState)(true);
	const [notifWeekly, setNotifWeekly] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (profile?.name) setName(profile.name);
	}, [profile?.name]);
	async function saveProfile() {
		if (!profile) return;
		setSaving(true);
		const { error } = await supabase.from("profiles").update({ name }).eq("id", profile.id);
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success("Profile updated");
		qc.invalidateQueries({ queryKey: ["profile"] });
		qc.invalidateQueries({ queryKey: ["me-profile"] });
	}
	async function changePassword() {
		if (newPwd.length < 6) return toast.error("Password must be at least 6 characters");
		const { error } = await supabase.auth.updateUser({ password: newPwd });
		if (error) return toast.error(error.message);
		setNewPwd("");
		toast.success("Password updated");
	}
	async function deleteAccount() {
		if (!confirm("Delete account permanently? This cannot be undone.")) return;
		if (!profile) return;
		await supabase.from("profiles").delete().eq("id", profile.id);
		await supabase.auth.signOut();
		router.navigate({ to: "/" });
		toast.success("Account data removed. Goodbye!");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-fade-up max-w-3xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold sm:text-4xl",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Manage your account and preferences."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: "Profile",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-16 w-16 place-items-center rounded-2xl gradient-violet text-xl font-bold text-white glow-violet",
						children: (name || profile?.email || "U").slice(0, 1).toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground",
							children: "Signed in as"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: profile?.email
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: setName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: saveProfile,
							disabled: saving,
							className: "inline-flex items-center gap-2 rounded-lg gradient-violet px-4 py-2 text-sm font-semibold text-white",
							children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
								size: 14,
								className: "animate-spin"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 14 }), " Save"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: "Change password",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New password" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: newPwd,
						onChange: setNewPwd,
						placeholder: "At least 6 characters"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: changePassword,
						className: "mt-3 rounded-lg border border-border bg-glass px-4 py-2 text-sm font-semibold glass-hover",
						children: "Update password"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: "Notifications",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
					label: "Email summaries",
					value: notifEmail,
					onChange: setNotifEmail
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
					label: "Weekly insights digest",
					value: notifWeekly,
					onChange: setNotifWeekly
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-rose/30 bg-rose/5 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-rose",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 16 }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display font-semibold",
								children: "Danger zone"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Permanently delete your account and all associated data."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: deleteAccount,
						className: "mt-4 rounded-lg border border-rose/40 bg-rose/10 px-4 py-2 text-sm font-semibold text-rose hover:bg-rose/20",
						children: "Delete account"
					})
				]
			})
		]
	}) });
}
function Card({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-glass p-6 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-4 font-display text-lg font-semibold",
			children: title
		}), children]
	});
}
function Label({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "block text-xs font-medium uppercase tracking-wider text-muted-foreground",
		children
	});
}
function Input({ value, onChange, type = "text", placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		value,
		onChange: (e) => onChange(e.target.value),
		placeholder,
		className: "mt-1.5 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:border-violet focus:outline-none focus:ring-2 focus:ring-violet/30"
	});
}
function Toggle({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => onChange(!value),
		className: "flex w-full items-center justify-between border-b border-border/40 py-3 text-sm last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `relative h-5 w-9 rounded-full transition ${value ? "gradient-violet" : "bg-white/10"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${value ? "left-[18px]" : "left-0.5"}` })
		})]
	});
}
//#endregion
export { SettingsPage as component };
