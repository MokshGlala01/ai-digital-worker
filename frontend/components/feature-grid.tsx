import { CalendarDays, Database, FileClock, GitBranch, MailCheck, ScrollText } from "lucide-react";

const features = [
  {
    icon: MailCheck,
    title: "Email Automation",
    description: "Summarize threads, draft replies, classify intent, and trigger next actions."
  },
  {
    icon: CalendarDays,
    title: "Smart Scheduling",
    description: "Find mutually available windows and prepare meeting invites with context."
  },
  {
    icon: Database,
    title: "Data Entry",
    description: "Extract structured fields and update operational systems with clean records."
  },
  {
    icon: GitBranch,
    title: "Task Chaining",
    description: "Turn one instruction into coordinated steps across tools and teams."
  },
  {
    icon: FileClock,
    title: "Agent Trace",
    description: "Show every planned action, simulated tool call, and completion state."
  },
  {
    icon: ScrollText,
    title: "Audit Logs",
    description: "Keep a reviewable trail for compliance, debugging, and handoffs."
  }
];

export function FeatureGrid() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">Core capabilities</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Automation that behaves like an accountable teammate.</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-lg border soft-border bg-white/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-glow dark:bg-white/[0.04]"
            >
              <feature.icon className="text-emerald-500 transition group-hover:scale-110" size={24} />
              <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
