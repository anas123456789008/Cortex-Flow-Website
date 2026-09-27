import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-j4Rv7MKA.mjs";
import { a as require_jsx_runtime, i as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as Brand, t as AuroraBackground } from "./aurora-background-BZIRHeSL.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as BsFillShieldLockFill } from "../_libs/react-icons.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-nLwsUS_h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPage() {
	const navigate = useNavigate();
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const hash = window.location.hash;
		if (hash.includes("type=recovery") || hash.includes("access_token")) setReady(true);
		else setReady(true);
	}, []);
	async function submit(e) {
		e.preventDefault();
		if (password !== confirm) return toast.error("Passwords don't match");
		if (password.length < 6) return toast.error("Min 6 characters");
		setLoading(true);
		const { error } = await supabase.auth.updateUser({ password });
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Password updated. Sign in.");
		navigate({ to: "/auth" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grain relative flex min-h-screen items-center justify-center px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuroraBackground, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, { size: "lg" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-glass p-7 backdrop-blur-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold",
						children: "Set a new password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Choose a strong password you haven't used before."
					}),
					ready && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "mt-6 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "New password",
								className: "w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm focus:border-violet focus:outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								value: confirm,
								onChange: (e) => setConfirm(e.target.value),
								placeholder: "Confirm password",
								className: "w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm focus:border-violet focus:outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: loading,
								className: "flex w-full items-center justify-center gap-2 rounded-lg gradient-violet px-4 py-2.5 text-sm font-semibold text-white glow-violet",
								children: [
									loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
										size: 14,
										className: "animate-spin"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BsFillShieldLockFill, { size: 12 }),
									" Update password"
								]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { ResetPage as component };
