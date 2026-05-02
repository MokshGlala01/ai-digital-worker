"use client";

import { AlertCircle, Bot, CheckCircle2, Loader2, Play, Sparkles } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type AgentStep = {
  id: string;
  title: string;
  detail: string;
  tool: string;
  status: string;
};

type AgentResponse = {
  steps: AgentStep[];
  result: string;
  mode: "openai" | "mock";
};

const examples = [
  "Check emails from the product team and schedule a 30-minute launch review.",
  "Review customer escalation notes, update CRM fields, and draft a follow-up email.",
  "Find next week's open calendar slots and prepare a project status workflow."
];

const agentApiUrl = process.env.NEXT_PUBLIC_AGENT_API_URL ?? "http://localhost:4000/api/agent";

export function DemoConsole() {
  const [task, setTask] = useState(examples[0]);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const visibleSteps = useMemo(() => {
    if (loading && !response) {
      return [
        { id: "loading-1", title: "Reading task intent", detail: "Classifying work type and selecting tools.", tool: "Planner", status: "running" },
        { id: "loading-2", title: "Preparing trace", detail: "Building a transparent execution plan.", tool: "Workflow", status: "queued" }
      ];
    }

    return response?.steps ?? [];
  }, [loading, response]);

  async function runTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTask = task.trim();

    if (!trimmedTask) {
      setError("Enter a task for the digital worker.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const apiResponse = await fetch(agentApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: trimmedTask })
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(data.error ?? "The agent could not complete this task.");
      }

      setResponse(data);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="demo" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">Live demo</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Give the agent a job. Watch it think in steps.</h2>
            <p className="mt-5 max-w-xl leading-8 text-slate-600 dark:text-slate-400">
              The demo calls the separate backend API. Add `OPENAI_API_KEY` for model-powered planning, or run it immediately with the included mock agent.
            </p>
            <div className="mt-8 grid gap-3">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setTask(example)}
                  className="rounded-lg border soft-border bg-white/70 p-4 text-left text-sm transition hover:border-emerald-400 hover:text-emerald-600 dark:bg-white/[0.04] dark:hover:text-mint"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 shadow-2xl shadow-emerald-950/10 sm:p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-500">
                  <Bot size={21} />
                </span>
                <div>
                  <h3 className="font-semibold">Digital Worker Console</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Email · Calendar · Data · Workflow</p>
                </div>
              </div>
              {response?.mode ? (
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-mint">
                  {response.mode === "openai" ? "OpenAI" : "Mock"} mode
                </span>
              ) : null}
            </div>

            <form onSubmit={runTask} className="space-y-3">
              <textarea
                value={task}
                onChange={(event) => setTask(event.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border soft-border bg-white/80 p-4 text-sm leading-6 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 dark:bg-slate-950/80"
                placeholder="Ask the agent to handle a workflow..."
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-ink shadow-glow transition hover:bg-mint disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                {loading ? "Running Task" : "Run Task"}
              </button>
            </form>

            {error ? (
              <div className="mt-5 flex gap-3 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                <AlertCircle size={18} />
                {error}
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              {visibleSteps.length ? (
                visibleSteps.map((step, index) => (
                  <div key={step.id} className="rounded-lg border soft-border bg-white/70 p-4 dark:bg-slate-950/50">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15 text-sm font-semibold text-emerald-600 dark:text-mint">
                        {loading && !response && index === 0 ? <Loader2 className="animate-spin" size={15} /> : index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{step.title}</p>
                          <span className="rounded-full border soft-border px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {step.tool}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.detail}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border soft-border bg-white/60 p-5 text-sm text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
                  Agent trace will appear here after you run a task.
                </div>
              )}
            </div>

            {response?.result ? (
              <div className="mt-5 rounded-lg bg-emerald-400/10 p-5">
                <div className="mb-2 flex items-center gap-2 font-semibold text-emerald-700 dark:text-mint">
                  <CheckCircle2 size={18} />
                  Final output
                </div>
                <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{response.result}</p>
              </div>
            ) : (
              <div className="mt-5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Sparkles size={16} />
                Ready for the next natural language task.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
