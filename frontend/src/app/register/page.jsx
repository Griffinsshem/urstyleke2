"use client";

import { useState, useCallback, useRef, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/auth";
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck,
} from "react-icons/fi";

const MAX_NAME_LEN   = 100;
const MAX_EMAIL_LEN  = 254;  
const MAX_PASSWD_LEN = 128;
const MIN_PASSWD_LEN = 8;
const MAX_ATTEMPTS   = 3;
const LOCKOUT_MS     = 60_000;

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= MIN_PASSWD_LEN) score++;
  if (pw.length >= 12)             score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw))            score++;
  if (/[^A-Za-z0-9]/.test(pw))    score++;
  const s = Math.min(4, score);
  const map = [
    { label: "",          color: "" },
    { label: "Weak",      color: "#ef4444" },
    { label: "Fair",      color: "#f97316" },
    { label: "Good",      color: "#eab308" },
    { label: "Strong",    color: "#22c55e" },
  ];
  return { score: s, ...map[s] };
}

const safeErrorMessage = (err) => {
  const msg = (err?.message ?? "").toLowerCase();
  if (msg.includes("email already")) return "An account with this email already exists.";
  if (msg.includes("network") || msg.includes("fetch")) return "Network error. Please check your connection.";
  return "Registration failed. Please try again.";
};

export default function RegisterPage() {
  const router      = useRouter();
  const nameId      = useId();
  const emailId     = useId();
  const passwordId  = useId();
  const confirmId   = useId();

  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "", email: "", password: "", confirm: "",
  });

  const attemptsRef = useRef(0);
  const lockedUntil = useRef(null);

  const strength = getPasswordStrength(password);

  const validate = useCallback(() => {
    const errs = { name: "", email: "", password: "", confirm: "" };
    let valid = true;

    const trimName  = name.trim();
    const trimEmail = email.trim();

    if (!trimName) {
      errs.name = "Full name is required."; valid = false;
    } else if (trimName.length > MAX_NAME_LEN) {
      errs.name = "Name is too long."; valid = false;
    } else if (!/^[\p{L}\s'\-\.]+$/u.test(trimName)) {
      errs.name = "Name contains invalid characters."; valid = false;
    }

    if (!trimEmail) {
      errs.email = "Email is required."; valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) {
      errs.email = "Enter a valid email address."; valid = false;
    } else if (trimEmail.length > MAX_EMAIL_LEN) {
      errs.email = "Email address is too long."; valid = false;
    }

    if (!password) {
      errs.password = "Password is required."; valid = false;
    } else if (password.length < MIN_PASSWD_LEN) {
      errs.password = `Password must be at least ${MIN_PASSWD_LEN} characters.`; valid = false;
    } else if (password.length > MAX_PASSWD_LEN) {
      errs.password = "Password exceeds maximum length."; valid = false;
    } else if (strength.score < 2) {
      errs.password = "Password is too weak. Add numbers or symbols."; valid = false;
    }

    if (!confirm) {
      errs.confirm = "Please confirm your password."; valid = false;
    } else if (confirm !== password) {
      errs.confirm = "Passwords do not match."; valid = false;
    }

    setFieldErrors(errs);
    return valid;
  }, [name, email, password, confirm, strength.score]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");

    if (lockedUntil.current && Date.now() < lockedUntil.current) {
      const s = Math.ceil((lockedUntil.current - Date.now()) / 1000);
      setError(`Too many attempts. Please wait ${s} seconds.`);
      return;
    }

    if (!validate()) return;

    setLoading(true);
    try {
      await registerUser({
        name:     name.trim().slice(0, MAX_NAME_LEN),
        email:    email.trim().slice(0, MAX_EMAIL_LEN),
        password: password.slice(0, MAX_PASSWD_LEN),
      });

      attemptsRef.current = 0;
      lockedUntil.current = null;
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2200);
    } catch (err) {
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        lockedUntil.current = Date.now() + LOCKOUT_MS;
        attemptsRef.current = 0;
        setError("Too many attempts. Please wait 60 seconds before trying again.");
      } else {
        setError(safeErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }, [name, email, password, confirm, router, validate]);

  const clearField = (field) =>
    setFieldErrors((p) => ({ ...p, [field]: "" }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] px-4 py-14">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* ── Card ─────────────────────────────────────────────────────── */}
        <div className="rounded-3xl border border-white/[0.07] bg-[#111111] p-8 shadow-2xl shadow-black/60">

          {/* Brand + heading */}
          <div className="mb-7 text-center">
            <span className="inline-block text-xs font-semibold tracking-[0.25em] text-white/30 uppercase mb-4">
              UrStyleKe
            </span>
            <h1 className="text-[1.9rem] font-bold tracking-tight text-white leading-tight">
              Create account
            </h1>
            <p className="mt-1.5 text-sm text-white/38">
              Join Kenya's premium fashion platform
            </p>
          </div>

          {success && (
            <div
              role="status"
              aria-live="polite"
              className="mb-5 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-3.5 text-sm text-green-400"
            >
              <FiCheck size={16} className="shrink-0" aria-hidden />
              <span>Account created! Redirecting you to sign in…</span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mt-0.5 h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Create account form"
            className="space-y-4"
          >
            {/* Full name */}
            <div className="space-y-1.5">
              <label
                htmlFor={nameId}
                className="block text-xs font-semibold tracking-wide text-white/42 uppercase"
              >
                Full name
              </label>
              <div className="relative">
                <FiUser
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/22"
                  size={15}
                />
                <input
                  id={nameId}
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? `${nameId}-error` : undefined}
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearField("name"); }}
                  placeholder="John Jane"
                  maxLength={MAX_NAME_LEN}
                  spellCheck={false}
                  className={`
                    w-full rounded-xl border bg-white/[0.04] py-3 pl-10 pr-3
                    text-sm text-white placeholder-white/18
                    transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-white/20
                    ${fieldErrors.name
                      ? "border-red-500/40 focus:ring-red-500/30"
                      : "border-white/[0.08] hover:border-white/[0.15]"
                    }
                  `}
                />
              </div>
              {fieldErrors.name && (
                <p id={`${nameId}-error`} role="alert" className="text-xs text-red-400">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor={emailId}
                className="block text-xs font-semibold tracking-wide text-white/42 uppercase"
              >
                Email address
              </label>
              <div className="relative">
                <FiMail
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/22"
                  size={15}
                />
                <input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? `${emailId}-error` : undefined}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearField("email"); }}
                  placeholder="jane@example.com"
                  maxLength={MAX_EMAIL_LEN}
                  spellCheck={false}
                  className={`
                    w-full rounded-xl border bg-white/[0.04] py-3 pl-10 pr-3
                    text-sm text-white placeholder-white/18
                    transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-white/20
                    ${fieldErrors.email
                      ? "border-red-500/40 focus:ring-red-500/30"
                      : "border-white/[0.08] hover:border-white/[0.15]"
                    }
                  `}
                />
              </div>
              {fieldErrors.email && (
                <p id={`${emailId}-error`} role="alert" className="text-xs text-red-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor={passwordId}
                className="block text-xs font-semibold tracking-wide text-white/42 uppercase"
              >
                Password
              </label>
              <div className="relative">
                <FiLock
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/22"
                  size={15}
                />
                <input
                  id={passwordId}
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={`${passwordId}-strength${fieldErrors.password ? ` ${passwordId}-error` : ""}`}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearField("password"); }}
                  placeholder="Min. 8 characters"
                  maxLength={MAX_PASSWD_LEN}
                  className={`
                    w-full rounded-xl border bg-white/[0.04] py-3 pl-10 pr-11
                    text-sm text-white placeholder-white/18
                    transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-white/20
                    ${fieldErrors.password
                      ? "border-red-500/40 focus:ring-red-500/30"
                      : "border-white/[0.08] hover:border-white/[0.15]"
                    }
                  `}
                />
                <button
                  type="button"
                  aria-label={showPass ? "Hide password" : "Show password"}
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/22 hover:text-white/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
                >
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>

              {/* Strength meter */}
              {password && (
                <div id={`${passwordId}-strength`} aria-live="polite" className="space-y-1.5">
                  <div className="flex gap-1" aria-hidden>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background:
                            i <= strength.score
                              ? strength.color
                              : "rgba(255,255,255,0.08)",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strength.color || "rgba(255,255,255,0.3)" }}>
                    {strength.label}
                  </p>
                </div>
              )}

              {fieldErrors.password && (
                <p id={`${passwordId}-error`} role="alert" className="text-xs text-red-400">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label
                htmlFor={confirmId}
                className="block text-xs font-semibold tracking-wide text-white/42 uppercase"
              >
                Confirm password
              </label>
              <div className="relative">
                <FiLock
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/22"
                  size={15}
                />
                <input
                  id={confirmId}
                  type={showConf ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.confirm}
                  aria-describedby={fieldErrors.confirm ? `${confirmId}-error` : undefined}
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); clearField("confirm"); }}
                  placeholder="Re-enter your password"
                  maxLength={MAX_PASSWD_LEN}
                  className={`
                    w-full rounded-xl border bg-white/[0.04] py-3 pl-10 pr-11
                    text-sm text-white placeholder-white/18
                    transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-white/20
                    ${fieldErrors.confirm
                      ? "border-red-500/40 focus:ring-red-500/30"
                      : confirm && confirm === password
                        ? "border-green-500/30"
                        : "border-white/[0.08] hover:border-white/[0.15]"
                    }
                  `}
                />
                {/* Match indicator */}
                {confirm && confirm === password && (
                  <FiCheck
                    aria-hidden
                    size={14}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-green-400"
                  />
                )}
                <button
                  type="button"
                  aria-label={showConf ? "Hide password" : "Show password"}
                  onClick={() => setShowConf((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/22 hover:text-white/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
                >
                  {showConf ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {fieldErrors.confirm && (
                <p id={`${confirmId}-error`} role="alert" className="text-xs text-red-400">
                  {fieldErrors.confirm}
                </p>
              )}
            </div>

            {/* Terms notice */}
            <p className="text-[11px] text-white/25 leading-relaxed pt-1">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="text-white/45 underline underline-offset-2 hover:text-white/70 transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-white/45 underline underline-offset-2 hover:text-white/70 transition-colors">
                Privacy Policy
              </Link>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="
                group relative mt-1 w-full overflow-hidden
                rounded-xl bg-white py-3 text-sm font-semibold text-black
                transition-all duration-200
                hover:bg-white/90 active:scale-[0.99]
                disabled:cursor-not-allowed disabled:opacity-40
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-white/60 focus-visible:ring-offset-2
                focus-visible:ring-offset-[#111]
              "
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating account…
                  </>
                ) : success ? (
                  <>
                    <FiCheck size={15} aria-hidden /> Account created
                  </>
                ) : (
                  <>
                    Create account
                    <FiArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3" aria-hidden>
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-xs text-white/20">or</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Sign in CTA */}
          <p className="text-center text-sm text-white/38">
            Already have an account?{" "}
            <Link
              href="/login"
              className="
                font-medium text-white/78
                underline underline-offset-2 decoration-white/20
                hover:text-white hover:decoration-white/60
                transition-colors duration-150
              "
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footnote */}
        <p className="mt-5 text-center text-[11px] text-white/18 select-none">
          Protected by industry-standard encryption · UrStyleKe&nbsp;©&nbsp;{new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
