import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "For founders testing agent workflows.",
    features: ["100 tasks / month", "Mock tool execution", "Basic audit trail"]
  },
  {
    name: "Team",
    price: "$149",
    description: "For operators running daily work.",
    features: ["2,000 tasks / month", "OpenAI agent mode", "Shared workflow library"],
    featured: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For governed automation at scale.",
    features: ["Private deployments", "SSO and retention controls", "Advanced audit exports"]
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Scale from demo to digital workforce.</h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-lg border p-6 transition hover:-translate-y-1 ${
                plan.featured
                  ? "border-emerald-400 bg-emerald-400/10 shadow-glow"
                  : "soft-border bg-white/70 dark:bg-white/[0.04]"
              }`}
            >
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{plan.description}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                {plan.price.startsWith("$") ? <span className="pb-1 text-slate-500">/mo</span> : null}
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="mt-0.5 text-emerald-500" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
