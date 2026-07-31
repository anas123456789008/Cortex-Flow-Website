import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, User as UserIcon, LogIn, UserPlus, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/components/brand";
import { AuroraBackground } from "@/components/aurora-background";
import { FcGoogle } from "react-icons/fc";
import { FaKey } from "react-icons/fa";
import { LucideIcon } from "lucide-react";

type Mode = "signin" | "signup" | "forgot";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · Cortex Flow" },
      { name: "description", content: "Sign in or create your Cortex Flow account." },
    ],
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
  },
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signin") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          throw new Error("Please enter a valid email address.");
        }

        if (!password || password.length < 6) {
          throw new Error("Please enter your password.");
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password. Please try again.");
          }
          throw error;
        }

        setEmail("");
        setPassword("");

        toast.success("Welcome back!");
        await navigate({ to: "/dashboard" });
      } else if (mode === "signup") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          throw new Error("Please enter a valid email address.");
        }

        if (!name || name.trim().length < 2) {
          throw new Error("Please enter your full name.");
        }

        if (password !== confirm) {
          throw new Error("Passwords don't match.");
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!passwordRegex.test(password)) {
          throw new Error(
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
          );
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: window.location.origin + "/dashboard",
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error("An account with this email already exists. Please sign in instead.");
          }
          throw error;
        }

        if (data.user && data.user.identities && data.user.identities.length === 0) {
          throw new Error("An account with this email already exists. Please sign in instead.");
        }

        setName("");
        setEmail("");
        setPassword("");
        setConfirm("");

        toast.success("Verification email sent successfully. Please check your inbox.");

        if (data.session) {
          await navigate({ to: "/dashboard" });
        } else {
          setMode("signin");
        }
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          throw new Error("Please enter a valid email address.");
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });

        if (error) throw error;

        toast.success("Password reset link sent! Check your inbox.");

        setEmail("");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function googleSignIn() {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dashboard",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  const pwdStrength = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const getSubmitIcon = () => {
    if (loading) return <Loader2 size={18} className="animate-spin" />;
    switch (mode) {
      case "signin":
        return <LogIn size={18} />;
      case "signup":
        return <UserPlus size={18} />;
      case "forgot":
        return <Send size={18} />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case "signin":
        return "Sign in";
      case "signup":
        return "Create account";
      case "forgot":
        return "Send reset link";
      default:
        return "";
    }
  };

  return (
    <div className="grain relative flex min-h-screen items-center justify-center px-4 py-10">
      <AuroraBackground />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link to="/">
            <Brand size="lg" />
          </Link>
        </div>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Turning data into financial wisdom
        </p>

        <div className="rounded-2xl border border-border bg-glass p-7 backdrop-blur-2xl shadow-[0_30px_80px_-30px_rgba(139,92,246,0.4)]">
          <h1 className="font-display text-2xl font-bold text-center">
            {mode === "signin" && "Welcome back"}
            {mode === "signup" && "Create your account"}
            {mode === "forgot" && "Reset password"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-center">
            {mode === "signin" && "Sign in to your Cortex dashboard"}
            {mode === "signup" && "Start turning your data into insights"}
            {mode === "forgot" && "We'll email you a reset link"}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field
                icon={UserIcon}
                type="text"
                placeholder="Full name"
                value={name}
                onChange={setName}
                autoComplete="name"
                required
              />
            )}

            <Field
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              required
            />

            {mode === "forgot" && (
              <p className="-mt-2 text-xs text-muted-foreground">
                Enter your email address and we'll send you a password reset link.
              </p>
            )}

            {mode !== "forgot" && (
              <div className="relative">
                <Field
                  icon={Lock}
                  type={showPwd ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={setPassword}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            )}

            {mode === "signup" && (
              <>
                <div className="relative">
                  <Field
                    icon={Lock}
                    type={showConfirmPwd ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirm}
                    onChange={setConfirm}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPwd ? "Hide password" : "Show password"}
                  >
                    {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition ${i <= pwdStrength
                            ? pwdStrength <= 1
                              ? "bg-rose-500"
                              : pwdStrength <= 2
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            : "bg-gray-200 dark:bg-gray-700"
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {pwdStrength <= 1 && "Weak password"}
                      {pwdStrength === 2 && "Fair password"}
                      {pwdStrength === 3 && "Good password"}
                      {pwdStrength === 4 && "Strong password"}
                    </p>
                  </div>
                )}
              </>
            )}

            <button
              disabled={loading}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {getSubmitIcon()}
              {getButtonText()}
            </button>
          </form>

          {mode !== "forgot" && (
            <>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" /> or{" "}
                <div className="h-px flex-1 bg-border" />
              </div>
              <button
                onClick={googleSignIn}
                disabled={loading || googleLoading}
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <FcGoogle size={20} />
                )}
                {googleLoading ? "Signing in..." : "Continue with Google"}
              </button>
            </>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
            {mode === "signin" && (
              <>
                <button
                  onClick={() => setMode("forgot")}
                  type="button"
                  className="inline-flex items-center gap-2 text-violet-600 hover:underline transition-colors"
                >
                  <span className="inline-block">
                    <FaKey size={12} />
                  </span>
                  Forgot password?
                </button>
                <div>
                  New here?{" "}
                  <button
                    onClick={() => setMode("signup")}
                    type="button"
                    className="font-medium text-foreground hover:text-violet-600 transition-colors"
                  >
                    Create account
                  </button>
                </div>
              </>
            )}
            {mode === "signup" && (
              <div>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  type="button"
                  className="font-medium text-foreground hover:text-violet-600 transition-colors"
                >
                  Sign in
                </button>
              </div>
            )}
            {mode === "forgot" && (
              <button
                onClick={() => setMode("signin")}
                type="button"
                className="text-violet-600 hover:underline transition-colors"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
}: {
  icon: LucideIcon;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <Icon
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-border bg-white/5 px-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition"
      />
    </div>
  );
}
