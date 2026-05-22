"use client";

import { useState, useCallback, useRef, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/auth";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";


const MAX_ATTEMPTS   = 5;
const LOCKOUT_MS     = 30_000; 
const MAX_EMAIL_LEN  = 254;    
const MAX_PASSWD_LEN = 128;  

const safeErrorMessage = (err) => {
  const known = [
    "invalid credentials",
    "too many requests",
    "account locked",
    "network",
  ];
  const msg = (err?.message ?? "").toLowerCase();
  if (known.some((k) => msg.includes(k))) return err.message;
  return "Invalid email or password. Please try again.";
};

export default function LoginPage() {
  const router        = useRouter();
  const emailId       = useId();
  const passwordId    = useId();

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const attemptsRef  = useRef(0);
  const lockedUntil  = useRef(null);

  const validate = useCallback(() => {
    const errs = { email: "", password: "" };
    let valid  = true;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errs.email = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = "Please enter a valid email address.";
      valid = false;
    } else if (trimmedEmail.length > MAX_EMAIL_LEN) {
      errs.email = "Email address is too long.";
      valid = false;
    }

    if (!password) {
      errs.password = "Password is required.";
      valid = false;
    } else if (password.length > MAX_PASSWD_LEN) {
      errs.password = "Password exceeds the maximum allowed length.";
      valid = false;
    }

    setFieldErrors(errs);
    return valid;
  }, [email, password]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (lockedUntil.current && Date.now() < lockedUntil.current) {
        const secsLeft = Math.ceil((lockedUntil.current - Date.now()) / 1000);
        setError(`Too many attempts. Please wait ${secsLeft} seconds.`);
        return;
      }

      if (!validate()) return;

      setLoading(true);

      try {
        await loginUser({
          email:    email.trim().slice(0, MAX_EMAIL_LEN),
          password: password.slice(0, MAX_PASSWD_LEN),
        });

        attemptsRef.current = 0;
        lockedUntil.current = null;

        router.push("/");
      } catch (err) {
        attemptsRef.current += 1;

        if (attemptsRef.current >= MAX_ATTEMPTS) {
          lockedUntil.current = Date.now() + LOCKOUT_MS;
          attemptsRef.current = 0;
          setError(
            `Account temporarily locked after ${MAX_ATTEMPTS} failed attempts. ` +
            `Please wait 30 seconds or reset your password.`
          );
        } else {
          setError(safeErrorMessage(err));
        }
      } finally {
        setLoading(false);
      }
    },
    [email, password, router, validate]
  );

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: "" }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: "" }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] px-4 py-12">
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
        <div className="rounded-3xl border border-white/[0.07] bg-[#111111] p-8 shadow-2xl shadow-black/60 backdrop-blur-sm">

          <div className="mb-8 text-center">
            <span className="inline-block text-xs font-semibold tracking-[0.25em] text-white/30 uppercase mb-4">
              UrStyleKe
            </span>
            <h1 className="text-[2rem] font-bold tracking-tight text-white leading-tight">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-white/40">
              Sign in to your account to continue
            </p>
          </div>

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
                aria-hidden="true"
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
            aria-label="Sign in form"
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label
                htmlFor={emailId}
                className="block text-xs font-medium tracking-wide text-white/50 uppercase"
              >
                Email address
              </label>
              <div className="relative">
                <FiMail
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                  size={16}
                />
                <input
                  id={emailId}
                  type="email"
                  autoComplete="username"
                  required
                  aria-required="true"
                  aria-describedby={fieldErrors.email ? `${emailId}-error` : undefined}
                  aria-invalid={!!fieldErrors.email}
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  maxLength={MAX_EMAIL_LEN}
                  spellCheck={false}
                  className={`
                    w-full rounded-xl border bg-white/[0.04] py-3 pl-10 pr-3
                    text-sm text-white placeholder-white/20
                    transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-white/20
                    ${fieldErrors.email
                      ? "border-red-500/40 focus:ring-red-500/30"
                      : "border-white/[0.08] hover:border-white/[0.14]"
                    }
                  `}
                />
              </div>
              {fieldErrors.email && (
                <p
                  id={`${emailId}-error`}
                  role="alert"
                  className="text-xs text-red-400"
                >
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={passwordId}
                  className="block text-xs font-medium tracking-wide text-white/50 uppercase"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-white/40 underline-offset-2 hover:text-white/70 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                  size={16}
                />
                <input
                  id={passwordId}
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  aria-describedby={fieldErrors.password ? `${passwordId}-error` : undefined}
                  aria-invalid={!!fieldErrors.password}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••••"
                  maxLength={MAX_PASSWD_LEN}
                  className={`
                    w-full rounded-xl border bg-white/[0.04] py-3 pl-10 pr-11
                    text-sm text-white placeholder-white/20
                    transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-white/20
                    ${fieldErrors.password
                      ? "border-red-500/40 focus:ring-red-500/30"
                      : "border-white/[0.08] hover:border-white/[0.14]"
                    }
                  `}
                />
                <button
                  type="button"
                  aria-label={showPass ? "Hide password" : "Show password"}
                  onClick={() => setShowPass((v) => !v)}
                  className="
                    absolute right-3.5 top-1/2 -translate-y-1/2
                    text-white/25 hover:text-white/60 transition-colors
                    focus-visible:outline-none focus-visible:ring-1
                    focus-visible:ring-white/40 rounded
                  "
                >
                  {showPass
                    ? <FiEyeOff size={16} />
                    : <FiEye    size={16} />
                  }
                </button>
              </div>
              {fieldErrors.password && (
                <p
                  id={`${passwordId}-error`}
                  role="alert"
                  className="text-xs text-red-400"
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                group relative mt-2 w-full overflow-hidden
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
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
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

          <div className="my-6 flex items-center gap-3" aria-hidden>
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-xs text-white/20">or</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <p className="text-center text-sm text-white/40">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="
                font-medium text-white/80
                underline underline-offset-2 decoration-white/20
                hover:text-white hover:decoration-white/60
                transition-colors duration-150
              "
            >
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-5 text-center text-[11px] text-white/20 select-none">
          Protected by industry-standard encryption · UrStyleKe&nbsp;©&nbsp;{new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
