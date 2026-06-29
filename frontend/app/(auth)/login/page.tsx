"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthVisual from "../components/auth/AuthVisual";
import { loginAction } from "@/lib/actions/auth-action";
// FIX: import schema from validations, not from auth-action, to avoid
// pulling a "use server" module into a client component
import { LoginSchema } from "@/lib/validations/auth-schemas";

interface FieldErrors {
  email?:    string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [form,         setForm]         = useState({ email: "", password: "" });
  const [fieldErrors,  setFieldErrors]  = useState<FieldErrors>({});
  const [globalError,  setGlobalError]  = useState("");
  const [isPending,    setIsPending]    = useState(false);
  const [showPw,       setShowPw]       = useState(false);

  function handleBlur(field: keyof typeof form) {
    const result = LoginSchema.shape[field].safeParse(form[field]);
    if (!result.success) {
      setFieldErrors((prev) => ({ ...prev, [field]: result.error.issues[0].message }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");

    const parsed = LoginSchema.safeParse(form);
    if (!parsed.success) {
      const errors: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FieldErrors;
        if (!errors[field]) errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    // FIX: disable button immediately to prevent double-submit
    setIsPending(true);
    const result = await loginAction(parsed.data);
    setIsPending(false);

    if (!result.success) {
      if (result.fieldErrors) setFieldErrors(result.fieldErrors as FieldErrors);
      if (result.message)     setGlobalError(result.message);
      return;
    }

    const user = (result.data as { user: { role: string } })?.user;
    if (user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <>
      <AuthVisual slide={0} />

      <div className="auth-form-panel">
        <div className="auth-form-panel__top">
          Don&apos;t have an account?&nbsp;
          <Link href="/signup">Register</Link>
        </div>

        <div className="auth-form-panel__inner">
          <h2 className="auth-heading">
            Welcome back<br />to VillaBaas!
          </h2>
          <p className="auth-subheading">Sign in to your account</p>

          {globalError && (
            <div className="form-error-banner">{globalError}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Your Email</label>
              <input
                id="email"
                type="email"
                placeholder=""
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={() => handleBlur("email")}
                className={fieldErrors.email ? "input-error" : ""}
              />
              {fieldErrors.email && (
                <p className="field-error">{fieldErrors.email}</p>
              )}
            </div>

            <div className="field field--password">
              <label htmlFor="password">Password</label>
              <div className="field-wrap">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onBlur={() => handleBlur("password")}
                  className={fieldErrors.password ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="toggle-pw"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="field-error">{fieldErrors.password}</p>
              )}
            </div>

            <div className="field-row">
              <label className="checkbox-label">
                <input type="checkbox" />
                Remember Me
              </label>
              <Link href="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? (
                <><span className="spinner" /> Signing in…</>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="divider">Instant Login</div>

          <div className="social-row">
            <button type="button" className="btn-social">
              <svg viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button type="button" className="btn-social">
              <svg viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          <p className="auth-switch">
            Don&apos;t have an account?&nbsp;
            <Link href="/signup">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
}