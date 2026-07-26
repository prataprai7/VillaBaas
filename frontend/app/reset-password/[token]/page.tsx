"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AuthVisual from "@/app/(auth)/components/auth/AuthVisual";
import { resetPasswordAction } from "@/lib/actions/auth-action";
import { ResetPasswordSchema } from "@/lib/validations/auth-schemas";

interface FieldErrors {
  password?: string;
  confirmPassword?: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [done, setDone] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleBlur(field: keyof typeof form) {
  const result = ResetPasswordSchema.safeParse(form);
  if (!result.success) {
    const issue = result.error.issues.find((i) => i.path[0] === field);
    setFieldErrors((prev) => ({ ...prev, [field]: issue?.message }));
  } else {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }
}

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");

    const parsed = ResetPasswordSchema.safeParse(form);
    if (!parsed.success) {
      const errors: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FieldErrors;
        if (!errors[field]) errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setIsPending(true);
    const result = await resetPasswordAction(token, parsed.data);
    setIsPending(false);

    if (!result.success) {
      if (result.fieldErrors) setFieldErrors(result.fieldErrors as FieldErrors);
      if (result.message) setGlobalError(result.message);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 2500);
  }

  return (
    <>
      <AuthVisual slide={0} />

      <div className="auth-form-panel">
        <div className="auth-form-panel__top">
          Remembered your password?&nbsp;
          <Link href="/login">Login</Link>
        </div>

        <div className="auth-form-panel__inner">
          <h2 className="auth-heading">
            Set a new<br />password
          </h2>
          <p className="auth-subheading">Choose a strong password for your account</p>

          {globalError && (
            <div className="form-error-banner">{globalError}</div>
          )}

          {done ? (
            <div
              className="form-error-banner"
              style={{ background: "#F2FAF5", borderColor: "rgba(39,174,96,0.25)", color: "#1e8449" }}
            >
              Password reset! Redirecting you to login…
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="field field--password">
                <label htmlFor="password">New Password</label>
                <div className="field-wrap">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
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

              <div className="field field--password">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="field-wrap">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={fieldErrors.confirmPassword ? "input-error" : ""}
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirm((v) => !v)}
                  >
                    {showConfirm ? (
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
                {fieldErrors.confirmPassword && (
                  <p className="field-error">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={isPending}>
                {isPending ? (
                  <><span className="spinner" /> Resetting…</>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          <p className="auth-switch">
            Remembered your password?&nbsp;
            <Link href="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}