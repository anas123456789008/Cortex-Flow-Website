import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-j4Rv7MKA.mjs";
import { a as require_jsx_runtime, i as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as Brand, t as AuroraBackground } from "./aurora-background-BZIRHeSL.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as EyeOff, C as LoaderCircle, S as Lock, i as UserPlus, k as Eye, p as Send, r as User, x as LogIn, y as Mail } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as FcGoogle, n as FaKey } from "../_libs/react-icons.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DoocH7OM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const [mode, setMode] = (0, import_react.useState)("signin");
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [googleLoading, setGoogleLoading] = (0, import_react.useState)(false);
	const [showPwd, setShowPwd] = (0, import_react.useState)(false);
	const [showConfirmPwd, setShowConfirmPwd] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [formErrors, setFormErrors] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		setFormErrors({});
		if (mode === "forgot") {
			setPassword("");
			setConfirm("");
		}
	}, [mode]);
	const validateEmail = (email) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};
	const validatePassword = (password) => {
		return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
	};
	const handleSignIn = async () => {
		const errors = {};
		if (!validateEmail(email)) errors.email = "Please enter a valid email address.";
		if (!password || password.length < 6) errors.password = "Please enter your password.";
		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			throw new Error("Please fix the errors below.");
		}
		setFormErrors({});
		const { error } = await supabase.auth.signInWithPassword({
			email: email.trim(),
			password
		});
		if (error) {
			if (error.message.includes("Invalid login credentials")) throw new Error("Invalid email or password. Please try again.");
			throw error;
		}
		setEmail("");
		setPassword("");
		toast.success("Welcome back!");
		await navigate({ to: "/dashboard" });
	};
	const handleSignUp = async () => {
		const errors = {};
		if (!validateEmail(email)) errors.email = "Please enter a valid email address.";
		if (!name || name.trim().length < 2) errors.name = "Please enter your full name (minimum 2 characters).";
		if (password !== confirm) errors.confirm = "Passwords don't match.";
		if (!validatePassword(password)) errors.password = "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.";
		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			throw new Error("Please fix the errors below.");
		}
		setFormErrors({});
		const { data, error } = await supabase.auth.signUp({
			email: email.trim(),
			password,
			options: {
				data: { full_name: name.trim() },
				emailRedirectTo: `${window.location.origin}/dashboard`
			}
		});
		if (error) {
			if (error.message.includes("already registered")) throw new Error("An account with this email already exists. Please sign in instead.");
			throw error;
		}
		if (data.user && !data.session) {
			toast.success("Verification email sent! Please check your inbox.");
			setName("");
			setEmail("");
			setPassword("");
			setConfirm("");
			setMode("signin");
			return;
		}
		if (data.user?.identities?.length === 0) throw new Error("An account with this email already exists. Please sign in instead.");
		if (data.session) {
			toast.success("Account created successfully!");
			setName("");
			setEmail("");
			setPassword("");
			setConfirm("");
			await navigate({ to: "/dashboard" });
		}
	};
	const handleForgotPassword = async () => {
		if (!validateEmail(email)) {
			setFormErrors({ email: "Please enter a valid email address." });
			throw new Error("Please enter a valid email address.");
		}
		setFormErrors({});
		const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
		if (error) {
			if (error.message.includes("not found")) throw new Error("No account found with this email address.");
			throw error;
		}
		toast.success("Password reset link sent! Check your inbox.");
		setEmail("");
		setMode("signin");
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setFormErrors({});
		try {
			switch (mode) {
				case "signin":
					await handleSignIn();
					break;
				case "signup":
					await handleSignUp();
					break;
				case "forgot": await handleForgotPassword();
			}
		} catch (err) {
			if (err instanceof Error && err.message !== "Please fix the errors below.") toast.error(err.message || "Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	const handleGoogleSignIn = async () => {
		setGoogleLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/dashboard`,
					queryParams: {
						access_type: "offline",
						prompt: "consent"
					}
				}
			});
			if (error) throw error;
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Google sign-in failed. Please try again.");
			setGoogleLoading(false);
		}
	};
	const getPasswordStrength = () => {
		let strength = 0;
		if (password.length >= 8) strength++;
		if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
		if (/[0-9]/.test(password)) strength++;
		if (/[^A-Za-z0-9]/.test(password)) strength++;
		return strength;
	};
	const getStrengthLabel = () => {
		const strength = getPasswordStrength();
		if (password.length === 0) return "";
		return [
			"Weak",
			"Fair",
			"Good",
			"Strong"
		][Math.min(Math.max(strength - 1, 0), 3)] || "Weak";
	};
	const getStrengthColor = (index) => {
		const strength = getPasswordStrength();
		if (index <= strength) {
			if (strength <= 1) return "bg-rose-500";
			if (strength <= 2) return "bg-amber-500";
			return "bg-emerald-500";
		}
		return "bg-gray-200 dark:bg-gray-700";
	};
	const getSubmitIcon = () => {
		if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
			size: 18,
			className: "animate-spin"
		});
		switch (mode) {
			case "signin": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { size: 18 });
			case "signup": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { size: 18 });
			case "forgot": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 18 });
			default: return null;
		}
	};
	const getButtonText = () => {
		switch (mode) {
			case "signin": return "Sign in";
			case "signup": return "Create account";
			case "forgot": return "Send reset link";
			default: return "";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grain relative flex min-h-screen items-center justify-center px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuroraBackground, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, { size: "lg" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-8 text-center text-sm text-muted-foreground",
					children: "Turning data into financial wisdom"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-glass p-7 backdrop-blur-2xl shadow-[0_30px_80px_-30px_rgba(139,92,246,0.4)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-2xl font-bold text-center",
							children: [
								mode === "signin" && "Welcome back",
								mode === "signup" && "Create your account",
								mode === "forgot" && "Reset password"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground text-center",
							children: [
								mode === "signin" && "Sign in to your Cortex dashboard",
								mode === "signup" && "Start turning your data into insights",
								mode === "forgot" && "We'll email you a reset link"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "mt-6 space-y-4",
							children: [
								mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									icon: User,
									type: "text",
									placeholder: "Full name",
									value: name,
									onChange: setName,
									autoComplete: "name",
									required: true
								}), formErrors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-red-500",
									children: formErrors.name
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									icon: Mail,
									type: "email",
									placeholder: "Email address",
									value: email,
									onChange: setEmail,
									autoComplete: mode === "signup" ? "email" : "email",
									required: true
								}), formErrors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-red-500",
									children: formErrors.email
								})] }),
								mode === "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "-mt-2 text-xs text-muted-foreground",
									children: "Enter your email address and we'll send you a password reset link."
								}),
								mode !== "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										icon: Lock,
										type: showPwd ? "text" : "password",
										placeholder: "Password",
										value: password,
										onChange: setPassword,
										autoComplete: mode === "signup" ? "new-password" : "current-password",
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowPwd(!showPwd),
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
										"aria-label": showPwd ? "Hide password" : "Show password",
										children: showPwd ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 })
									})]
								}), formErrors.password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-red-500",
									children: formErrors.password
								})] }),
								mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										icon: Lock,
										type: showConfirmPwd ? "text" : "password",
										placeholder: "Confirm password",
										value: confirm,
										onChange: setConfirm,
										autoComplete: "new-password",
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowConfirmPwd(!showConfirmPwd),
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
										"aria-label": showConfirmPwd ? "Hide password" : "Show password",
										children: showConfirmPwd ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 })
									})]
								}), formErrors.confirm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-red-500",
									children: formErrors.confirm
								})] }), password && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-1",
										children: [
											1,
											2,
											3,
											4
										].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1 flex-1 rounded-full transition-colors ${getStrengthColor(i)}` }, i))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: ["Password strength: ", getStrengthLabel()]
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									disabled: loading,
									type: "submit",
									className: "flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer",
									children: [getSubmitIcon(), getButtonText()]
								})
							]
						}),
						mode !== "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-5 flex items-center gap-3 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
								" or",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleGoogleSignIn,
							disabled: loading || googleLoading,
							type: "button",
							className: "flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer",
							children: [googleLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
								size: 20,
								className: "animate-spin"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FcGoogle, { size: 20 }), googleLoading ? "Signing in..." : "Continue with Google"]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 text-center text-sm text-muted-foreground space-y-2",
							children: [
								mode === "signin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setMode("forgot"),
									type: "button",
									className: "inline-flex items-center gap-2 text-violet-600 hover:underline transition-colors cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaKey, { size: 12 }), "Forgot password?"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									"New here?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setMode("signup"),
										type: "button",
										className: "font-medium text-foreground hover:text-violet-600 transition-colors cursor-pointer",
										children: "Create account"
									})
								] })] }),
								mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									"Already have an account?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setMode("signin"),
										type: "button",
										className: "font-medium text-foreground hover:text-violet-600 transition-colors cursor-pointer",
										children: "Sign in"
									})
								] }),
								mode === "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMode("signin"),
									type: "button",
									className: "text-violet-600 hover:underline transition-colors cursor-pointer",
									children: "Back to sign in"
								})
							]
						})
					]
				})
			]
		})]
	});
}
function Field({ icon: Icon, type = "text", placeholder, value, onChange, required = false, autoComplete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			size: 16,
			className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			required,
			autoComplete,
			className: "w-full rounded-lg border border-border bg-white/5 px-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition"
		})]
	});
}
//#endregion
export { AuthPage as component };
