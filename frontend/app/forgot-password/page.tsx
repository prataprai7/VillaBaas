"use client";

import { useState } from "react";
import Link from "next/link";
import AuthVisual from "../(auth)/components/auth/AuthVisual";
import { forgotPasswordAction } from "@/lib/actions/auth-action";
import { ForgotPasswordSchema } from "@/lib/validations/auth-schemas";

interface FieldErrors {
  email?: string;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [sent, setSent] = useState(false);

  function handleBlur() {
    const result = ForgotPasswordSchema.shape.email.safeParse(email);
    if (!result.success) {
      setFieldErrors({ email: result.error.issues[0].message });
    } else {
      setFieldErrors({});
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");

    const parsed = ForgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setFieldErrors({ email: parsed.error.issues[0]?.message });
      return;
    }

    setIsPending(true);
    const result = await forgotPasswordAction(parsed.data);
    setIsPending(false);

    if (!result.success) {
      if (result.fieldErrors) setFieldErrors(result.fieldErrors as FieldErrors);
      if (result.message) setGlobalError(result.message);
      return;
    }

    setSent(true);
  }

  return (
    <>
      <AuthVisual slide={1} />

      <div className="auth-form-panel">
        <div className="auth-form-panel__top">
          Remembered your password?&nbsp;
          <Link href="/login">Login</Link>
        </div>

        <div className="auth-form-panel__inner">
          <h2 className="auth-heading">
            Forgot your<br />password?
          </h2>
          <p className="auth-subheading">Enter your email and we&apos;ll send you a reset link</p>

          {globalError && (
            <div className="form-error-banner">{globalError}</div>
          )}

          {sent ? (
            <div
              className="form-error-banner"
              style={{ background: "#F2FAF5", borderColor: "rgba(39,174,96,0.25)", color: "#1e8449" }}
            >
              If an account exists for that email, a reset link is on its way. Check your inbox and spam folder — the link expires in 15 minutes.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="email">Your Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  className={fieldErrors.email ? "input-error" : ""}
                />
                {fieldErrors.email && (
                  <p className="field-error">{fieldErrors.email}</p>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={isPending}>
                {isPending ? (
                  <><span className="spinner" /> Sending…</>
                ) : (
                  "Send reset link"
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