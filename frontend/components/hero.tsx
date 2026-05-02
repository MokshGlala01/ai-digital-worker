import { ArrowRight, CheckCircle2, Clock3, Mail, Network, ShieldCheck } from "lucide-react";

const timeline = [
  { icon: Mail, label: "Email scan", value: "12 threads mapped" },
  { icon: Clock3, label: "Calendar match", value: "3 slots ranked" },
  { icon: Network, label: "Workflow chain", value: "5 actions queued" },
  { icon: ShieldCheck, label: "Audit log", value: "Trace complete" }
];

export function Hero() {
  return (
    <section className="relative pt-24">
      <div className="absolute inset-0 -z-10 grid-mask opacity-60" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-24">
        <div className="animate-fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border soft-border bg-white/60 px-3 py-1 text-sm text-slate-600 shadow-sm dark:bg-white/5 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-mint shadow-glow" />
            Enterprise automation with visible reasoning
          </div>
          <h1 className="text-balance text-5xl font-semibold tracking-tight text-ink dark:text-white sm:text-6xl lg:text-7xl">
            Your AI Employee That Works 24/7
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Assign natural language work, watch the agent plan each step, and receive a completed workflow with traceable email, calendar, data, and audit actions.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-ink shadow-glow transition hover:bg-mint"
            >
              Try Demo <ArrowRight size={18} />
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-lg border soft-border bg-white/70 px-5 py-3 font-semibold text-ink transition hover:border-emerald-400 dark:bg-white/5 dark:text-white"
            >
              Explore Features
            </a>
          </div>
        </div>

        <div className="relative animate-fade-up lg:animation-delay-200">
          <div className="glass-panel overflow-hidden rounded-xl shadow-2xl shadow-emerald-950/10">
            <div className="flex items-center justify-between border-b soft-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                Agent Trace
              </span>
            </div>
            <div className="grid gap-4 p-4 sm:p-6">
              <div className="rounded-lg border soft-border bg-slate-950 p-4 text-white">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-slate-400">Task</p>
                  <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-xs text-mint">
                    Running
                  </span>
                </div>
                <p className="text-lg font-medium">Check investor emails and schedule the fastest follow-up.</p>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-3/4 origin-left animate-pulsebar rounded-full bg-gradient-to-r from-mint to-aqua" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {timeline.map((item) => (
                  <div key={item.label} className="rounded-lg border soft-border bg-white/70 p-4 dark:bg-white/[0.04]">
                    <item.icon className="mb-3 text-emerald-500" size={20} />
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-emerald-400/10 p-4 text-sm text-emerald-700 dark:text-mint">
                <CheckCircle2 size={18} />
                Draft sent, meeting held, audit trail ready.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
