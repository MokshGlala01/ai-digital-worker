"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Bot, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("founder@digitalworker.ai");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.includes("@") || password.length < 6) {
      setError("Enter a valid email and a password with at least 6 characters.");
      return;
    }

    setError("");
    router.push("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060a12] text-white">
      <div className="absolute inset-0 grid-mask opacity-30" />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="hidden lg:block">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
            <Sparkles size={15} className="text-mint" />
            Secure access to your AI operations workspace
          </div>
          <h1 className="max-w-2xl text-6xl font-semibold tracking-tight">
            AI Task Automation Agent
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Sign in to launch your digital worker, run natural language workflows, and review every agent decision with a transparent execution trace.
          </p>
          <div className="mt-10 grid max-w-xl gap-3">
            {["Visible reasoning for every task", "Email, calendar, data, and workflow simulation", "Audit-ready trace for teams and investors"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <CheckCircle2 size={18} className="text-mint" />
                <span className="text-sm text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-3 lg:justify-start">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-ink shadow-glow">
              <Bot size={22} />
            </span>
            <div>
              <p className="font-semibold">Digital Worker</p>
              <p className="text-sm text-slate-400">Agent control center</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl sm:p-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Use the demo credentials already filled in, or enter any valid email and 6+ character password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-300">Email</span>
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-400/10">
                  <Mail size={18} className="text-slate-500" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-600"
                    placeholder="you@company.com"
                    type="email"
                    autoComplete="email"
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-300">Password</span>
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-400/10">
                  <LockKeyhole size={18} className="text-slate-500" />
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-600"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                    className="text-slate-500 transition hover:text-mint"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-slate-400">
                  <input
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-slate-950 text-emerald-400 accent-emerald-400"
                  />
                  Remember me
                </label>
                <button type="button" className="font-medium text-mint transition hover:text-aqua">
                  Forgot password?
                </button>
              </div>

              {error ? (
                <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-ink shadow-glow transition hover:bg-mint"
              >
                Sign in to workspace <ArrowRight size={18} />
              </button>

              <a
                href="/dashboard#demo"
                className="inline-flex w-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-mint"
              >
                Continue with demo access
              </a>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
