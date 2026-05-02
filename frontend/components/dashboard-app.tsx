"use client";

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertCircle,
  Archive,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  FileClock,
  GitBranch,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  MailCheck,
  Play,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  UserRound,
  UsersRound
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type ViewKey = "workspace" | "inbox" | "calendar" | "workflows" | "audit" | "settings";

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

type RunRecord = {
  id: string;
  task: string;
  status: "Completed" | "Running" | "Failed";
  time: string;
  mode: "openai" | "mock";
};

const agentApiUrl = process.env.NEXT_PUBLIC_AGENT_API_URL ?? "http://localhost:4000/api/agent";

const navItems: Array<{ key: ViewKey; label: string; icon: LucideIcon }> = [
  { key: "workspace", label: "Workspace", icon: LayoutDashboard },
  { key: "inbox", label: "Inbox", icon: Inbox },
  { key: "calendar", label: "Calendar", icon: CalendarDays },
  { key: "workflows", label: "Workflows", icon: GitBranch },
  { key: "audit", label: "Audit Logs", icon: FileClock },
  { key: "settings", label: "Settings", icon: Settings }
];

const templates = [
  {
    title: "Email triage",
    task: "Check priority emails, summarize urgent threads, and draft replies for anything blocking launch.",
    icon: MailCheck
  },
  {
    title: "Meeting scheduler",
    task: "Find open slots this week, schedule a 30-minute stakeholder sync, and prepare an agenda.",
    icon: CalendarDays
  },
  {
    title: "CRM updater",
    task: "Review customer escalation notes, update CRM fields, assign owners, and create follow-up reminders.",
    icon: Database
  },
  {
    title: "Daily operations chain",
    task: "Create a daily operations workflow with email review, status summary, data updates, and audit notes.",
    icon: GitBranch
  }
];

const integrations = [
  { name: "Gmail", status: "Connected", icon: Inbox },
  { name: "Google Calendar", status: "Connected", icon: CalendarDays },
  { name: "CRM", status: "Sandbox", icon: Database },
  { name: "Audit Vault", status: "Active", icon: ShieldCheck }
];

const inboxThreads = [
  {
    from: "Priya Shah",
    subject: "Launch review deck is ready",
    intent: "Schedule meeting",
    priority: "High",
    time: "11:28 AM"
  },
  {
    from: "Marcus Lee",
    subject: "Customer escalation notes",
    intent: "Update CRM",
    priority: "High",
    time: "10:12 AM"
  },
  {
    from: "Nora Patel",
    subject: "Vendor contract follow-up",
    intent: "Draft reply",
    priority: "Medium",
    time: "9:44 AM"
  },
  {
    from: "Finance Ops",
    subject: "Invoice reconciliation queue",
    intent: "Extract data",
    priority: "Medium",
    time: "Yesterday"
  }
];

const calendarEvents = [
  { title: "Investor launch sync", time: "Today, 2:00 PM", owner: "Priya Shah", status: "Ready" },
  { title: "Customer escalation review", time: "Tomorrow, 10:30 AM", owner: "Marcus Lee", status: "Agenda drafted" },
  { title: "Weekly operations standup", time: "Friday, 9:00 AM", owner: "Ops Team", status: "Recurring" }
];

const auditRows = [
  { event: "Agent generated meeting agenda", actor: "Digital Worker", tool: "Calendar", time: "11:43 AM" },
  { event: "CRM owner field updated", actor: "Digital Worker", tool: "Data", time: "10:39 AM" },
  { event: "Email draft prepared for review", actor: "Digital Worker", tool: "Email", time: "10:21 AM" },
  { event: "Workflow template selected", actor: "Founder", tool: "Planner", time: "9:58 AM" }
];

export function DashboardApp() {
  const [activeView, setActiveView] = useState<ViewKey>("workspace");
  const [task, setTask] = useState(templates[1].task);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [runs, setRuns] = useState<RunRecord[]>([
    {
      id: "run-1038",
      task: "Prepared launch review agenda and owner list",
      status: "Completed",
      time: "10:42 AM",
      mode: "mock"
    },
    {
      id: "run-1037",
      task: "Updated CRM follow-up fields for escalation queue",
      status: "Completed",
      time: "9:18 AM",
      mode: "mock"
    }
  ]);

  const activeTitle = navItems.find((item) => item.key === activeView)?.label ?? "Workspace";
  const visibleSteps = useMemo(() => {
    if (loading && !response) {
      return [
        {
          id: "thinking",
          title: "Planning execution",
          detail: "Selecting tools, dependencies, owners, and audit requirements.",
          tool: "Planner"
        },
        {
          id: "routing",
          title: "Routing workflow",
          detail: "Preparing email, calendar, data, and trace operations.",
          tool: "Workflow"
        }
      ];
    }

    return response?.steps ?? [];
  }, [loading, response]);

  async function runTask(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
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
      setRuns((current) => [
        {
          id: `run-${Date.now()}`,
          task: trimmedTask,
          status: "Completed",
          time: new Intl.DateTimeFormat("en", {
            hour: "numeric",
            minute: "2-digit"
          }).format(new Date()),
          mode: data.mode
        },
        ...current.slice(0, 4)
      ]);
      setActiveView("workspace");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function loadTask(nextTask: string, nextView: ViewKey = "workspace") {
    setTask(nextTask);
    setActiveView(nextView);
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-[#060a12] dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r soft-border bg-white/80 px-4 py-5 backdrop-blur-xl dark:bg-slate-950/70 lg:block">
          <div className="flex items-center gap-3 px-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-mint dark:bg-white dark:text-ink">
              <Bot size={21} />
            </span>
            <div>
              <p className="font-semibold">Digital Worker</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Operations OS</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1" aria-label="Workspace navigation">
            {navItems.map((item) => {
              const isActive = activeView === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveView(item.key)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-400/15 text-emerald-700 dark:text-mint"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-lg border soft-border bg-slate-50 p-4 dark:bg-white/[0.04]">
            <p className="text-sm font-semibold">Agent capacity</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-mint to-aqua" />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
              72% automation quota used across email, calendar, CRM, and audit runs.
            </p>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b soft-border bg-white/78 px-4 py-3 backdrop-blur-xl dark:bg-[#060a12]/78 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{activeTitle}</p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">AI Task Automation Agent</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-lg border soft-border bg-white px-3 py-2 text-sm text-slate-500 dark:bg-white/[0.04] md:flex">
                  <Search size={16} />
                  Search runs
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border soft-border bg-white dark:bg-white/[0.04]">
                  <UserRound size={18} />
                </div>
                <a
                  href="/"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border soft-border bg-white text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600 dark:bg-white/[0.04] dark:text-slate-300"
                  aria-label="Log out"
                >
                  <LogOut size={18} />
                </a>
              </div>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveView(item.key)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                    activeView === item.key
                      ? "border-emerald-400 bg-emerald-400/15 text-emerald-700 dark:text-mint"
                      : "soft-border bg-white text-slate-600 dark:bg-white/[0.04] dark:text-slate-300"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          </header>

          {activeView === "workspace" ? (
            <WorkspaceView
              task={task}
              setTask={setTask}
              runTask={runTask}
              loading={loading}
              error={error}
              response={response}
              visibleSteps={visibleSteps}
              runs={runs}
              loadTask={loadTask}
            />
          ) : null}

          {activeView === "inbox" ? <InboxView loadTask={loadTask} /> : null}
          {activeView === "calendar" ? <CalendarView loadTask={loadTask} /> : null}
          {activeView === "workflows" ? <WorkflowsView loadTask={loadTask} /> : null}
          {activeView === "audit" ? <AuditView runs={runs} /> : null}
          {activeView === "settings" ? <SettingsView /> : null}
        </section>
      </div>
    </main>
  );
}

function WorkspaceView({
  task,
  setTask,
  runTask,
  loading,
  error,
  response,
  visibleSteps,
  runs,
  loadTask
}: {
  task: string;
  setTask: (task: string) => void;
  runTask: (event?: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error: string;
  response: AgentResponse | null;
  visibleSteps: Array<Pick<AgentStep, "id" | "title" | "detail" | "tool">>;
  runs: RunRecord[];
  loadTask: (task: string, view?: ViewKey) => void;
}) {
  return (
    <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Tasks automated" value="1,284" trend="+18%" icon={Activity} />
          <Metric label="Hours saved" value="412" trend="+31%" icon={Clock3} />
          <Metric label="Success rate" value="98.6%" trend="+2.4%" icon={CheckCircle2} />
          <Metric label="Open approvals" value="7" trend="Needs review" icon={Archive} />
        </div>

        <section className="rounded-xl border soft-border bg-white p-4 shadow-sm dark:bg-white/[0.04] sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-500">Command center</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Assign work to your AI employee</h2>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-mint">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Backend online
            </span>
          </div>

          <form onSubmit={runTask} className="mt-5 space-y-3">
            <textarea
              value={task}
              onChange={(event) => setTask(event.target.value)}
              rows={5}
              className="w-full resize-none rounded-lg border soft-border bg-slate-50 p-4 text-sm leading-6 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 dark:bg-slate-950/80"
              placeholder="Describe the business task..."
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Routes through email, calendar, data, workflow, and audit tools.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-ink shadow-glow transition hover:bg-mint disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                {loading ? "Running" : "Run automation"}
              </button>
            </div>
          </form>

          {error ? (
            <div className="mt-4 flex gap-3 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              <AlertCircle size={18} />
              {error}
            </div>
          ) : null}
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <TemplatePanel loadTask={loadTask} />
          <TracePanel response={response} visibleSteps={visibleSteps} loading={loading} />
        </section>

        {response?.result ? (
          <section className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-5">
            <div className="mb-2 flex items-center gap-2 font-semibold text-emerald-700 dark:text-mint">
              <CheckCircle2 size={18} />
              Final output
            </div>
            <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{response.result}</p>
          </section>
        ) : null}
      </section>

      <aside className="space-y-5">
        <ConnectedTools />
        <RecentRuns runs={runs} />
      </aside>
    </div>
  );
}

function InboxView({ loadTask }: { loadTask: (task: string, view?: ViewKey) => void }) {
  return (
    <ViewShell
      eyebrow="Inbox automation"
      title="Prioritize, summarize, and act on email threads"
      description="Click any thread action to push a ready-to-run instruction into the command center."
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <section className="rounded-xl border soft-border bg-white p-4 shadow-sm dark:bg-white/[0.04] sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Priority inbox</h2>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-mint">
              {inboxThreads.length} actionable
            </span>
          </div>
          <div className="mt-4 divide-y soft-border overflow-hidden rounded-lg border soft-border">
            {inboxThreads.map((thread) => (
              <div key={thread.subject} className="grid gap-3 bg-slate-50 p-4 dark:bg-slate-950/60 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{thread.subject}</p>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-300">
                      {thread.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {thread.from} - {thread.intent} - {thread.time}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    loadTask(`Review the email thread "${thread.subject}", summarize it, and complete the next action: ${thread.intent}.`)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg border soft-border bg-white px-3 py-2 text-sm font-semibold transition hover:border-emerald-400 hover:text-emerald-600 dark:bg-white/[0.04] dark:hover:text-mint"
                >
                  Automate <ChevronRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <InsightCard
          icon={MailCheck}
          title="Inbox rules"
          lines={["Urgent launch emails auto-tagged", "Stakeholder replies grouped by project", "Drafts require human approval"]}
        />
      </div>
    </ViewShell>
  );
}

function CalendarView({ loadTask }: { loadTask: (task: string, view?: ViewKey) => void }) {
  return (
    <ViewShell
      eyebrow="Smart scheduling"
      title="Coordinate meetings without leaving the workspace"
      description="Review upcoming events, then ask the agent to schedule, draft agendas, or prepare follow-ups."
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <section className="rounded-xl border soft-border bg-white p-4 shadow-sm dark:bg-white/[0.04] sm:p-5">
          <h2 className="font-semibold">Calendar queue</h2>
          <div className="mt-4 grid gap-3">
            {calendarEvents.map((event) => (
              <div key={event.title} className="rounded-lg border soft-border bg-slate-50 p-4 dark:bg-slate-950/60">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {event.time} - {event.owner}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-mint">
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <ActionPanel
          title="Schedule action"
          icon={CalendarDays}
          actions={[
            {
              label: "Find best meeting slot",
              task: "Find the best 30-minute slot this week for the launch team and prepare a calendar invite."
            },
            {
              label: "Draft follow-up agenda",
              task: "Prepare a follow-up agenda for the next stakeholder meeting and assign owners."
            }
          ]}
          loadTask={loadTask}
        />
      </div>
    </ViewShell>
  );
}

function WorkflowsView({ loadTask }: { loadTask: (task: string, view?: ViewKey) => void }) {
  return (
    <ViewShell
      eyebrow="Workflow builder"
      title="Reusable automations for daily operations"
      description="Pick a chain to load it into the command center, then run it through the backend agent."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {templates.map((template) => (
          <button
            key={template.title}
            type="button"
            onClick={() => loadTask(template.task)}
            className="group rounded-xl border soft-border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-glow dark:bg-white/[0.04]"
          >
            <template.icon className="text-emerald-500" size={24} />
            <h2 className="mt-4 text-lg font-semibold">{template.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{template.task}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-mint">
              Load workflow <ChevronRight size={15} />
            </span>
          </button>
        ))}
      </div>
    </ViewShell>
  );
}

function AuditView({ runs }: { runs: RunRecord[] }) {
  return (
    <ViewShell
      eyebrow="Audit logs"
      title="Trace every agent decision and tool action"
      description="Review execution history, simulated tool usage, owners, and recent run results."
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <section className="rounded-xl border soft-border bg-white p-4 shadow-sm dark:bg-white/[0.04] sm:p-5">
          <h2 className="font-semibold">Event trail</h2>
          <div className="mt-4 overflow-hidden rounded-lg border soft-border">
            {auditRows.map((row) => (
              <div key={`${row.event}-${row.time}`} className="grid gap-2 border-b soft-border bg-slate-50 p-4 last:border-b-0 dark:bg-slate-950/60 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-medium">{row.event}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {row.actor} - {row.tool}
                  </p>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">{row.time}</span>
              </div>
            ))}
          </div>
        </section>

        <RecentRuns runs={runs} />
      </div>
    </ViewShell>
  );
}

function SettingsView() {
  const settings = [
    { label: "Require approval before sending emails", enabled: true, icon: MailCheck },
    { label: "Auto-create calendar holds", enabled: true, icon: CalendarDays },
    { label: "Store detailed audit traces", enabled: true, icon: ShieldCheck },
    { label: "Notify owner on failed runs", enabled: false, icon: Bell }
  ];

  return (
    <ViewShell
      eyebrow="Workspace settings"
      title="Control how the digital worker operates"
      description="Configure approvals, integrations, security posture, and notification behavior."
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <section className="rounded-xl border soft-border bg-white p-4 shadow-sm dark:bg-white/[0.04] sm:p-5">
          <h2 className="font-semibold">Automation controls</h2>
          <div className="mt-4 grid gap-3">
            {settings.map((setting) => (
              <div key={setting.label} className="flex items-center justify-between gap-4 rounded-lg border soft-border bg-slate-50 p-4 dark:bg-slate-950/60">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-600 dark:bg-white/10 dark:text-mint">
                    <setting.icon size={17} />
                  </span>
                  <p className="text-sm font-medium">{setting.label}</p>
                </div>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  setting.enabled
                    ? "bg-emerald-400/15 text-emerald-700 dark:text-mint"
                    : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                }`}>
                  <ToggleLeft size={14} />
                  {setting.enabled ? "On" : "Off"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <InsightCard
            icon={KeyRound}
            title="Security"
            lines={["SSO ready", "API key stored in backend env", "No browser secrets exposed"]}
          />
          <InsightCard
            icon={UsersRound}
            title="Team"
            lines={["3 workspace admins", "12 reviewers", "Approval policy enabled"]}
          />
        </section>
      </div>
    </ViewShell>
  );
}

function TemplatePanel({ loadTask }: { loadTask: (task: string, view?: ViewKey) => void }) {
  return (
    <div className="rounded-xl border soft-border bg-white p-4 shadow-sm dark:bg-white/[0.04] sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Workflow templates</h2>
        <Sparkles size={18} className="text-emerald-500" />
      </div>
      <div className="mt-4 grid gap-3">
        {templates.map((template) => (
          <button
            key={template.title}
            type="button"
            onClick={() => loadTask(template.task)}
            className="group flex items-center gap-3 rounded-lg border soft-border bg-slate-50 p-3 text-left transition hover:border-emerald-400 hover:bg-emerald-400/10 dark:bg-slate-950/60"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 dark:bg-white/10 dark:text-mint">
              <template.icon size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{template.title}</span>
              <span className="line-clamp-1 block text-xs text-slate-500 dark:text-slate-400">
                {template.task}
              </span>
            </span>
            <ChevronRight size={16} className="text-slate-400 transition group-hover:text-emerald-500" />
          </button>
        ))}
      </div>
    </div>
  );
}

function TracePanel({
  response,
  visibleSteps,
  loading
}: {
  response: AgentResponse | null;
  visibleSteps: Array<Pick<AgentStep, "id" | "title" | "detail" | "tool">>;
  loading: boolean;
}) {
  return (
    <div className="rounded-xl border soft-border bg-white p-4 shadow-sm dark:bg-white/[0.04] sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Agent trace</h2>
        {response?.mode ? (
          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-mint">
            {response.mode === "openai" ? "OpenAI" : "Mock"} mode
          </span>
        ) : null}
      </div>
      <div className="mt-4 space-y-3">
        {visibleSteps.length ? (
          visibleSteps.map((step, index) => (
            <div key={step.id} className="rounded-lg border soft-border bg-slate-50 p-3 dark:bg-slate-950/60">
              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15 text-xs font-bold text-emerald-700 dark:text-mint">
                  {loading && index === 0 ? <Loader2 className="animate-spin" size={15} /> : index + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{step.title}</p>
                    <span className="rounded-full border soft-border px-2 py-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {step.tool}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.detail}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border soft-border bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
            Run an automation to see live planning, tool usage, and audit trace.
          </div>
        )}
      </div>
    </div>
  );
}

function ConnectedTools() {
  return (
    <section className="rounded-xl border soft-border bg-white p-4 shadow-sm dark:bg-white/[0.04] sm:p-5">
      <h2 className="font-semibold">Connected tools</h2>
      <div className="mt-4 space-y-3">
        {integrations.map((integration) => (
          <div key={integration.name} className="flex items-center justify-between rounded-lg border soft-border bg-slate-50 p-3 dark:bg-slate-950/60">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-600 dark:bg-white/10 dark:text-mint">
                <integration.icon size={17} />
              </span>
              <div>
                <p className="text-sm font-semibold">{integration.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{integration.status}</p>
              </div>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentRuns({ runs }: { runs: RunRecord[] }) {
  return (
    <section className="rounded-xl border soft-border bg-white p-4 shadow-sm dark:bg-white/[0.04] sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Recent runs</h2>
        <FileClock size={18} className="text-slate-400" />
      </div>
      <div className="mt-4 space-y-3">
        {runs.map((run) => (
          <div key={run.id} className="rounded-lg border soft-border bg-slate-50 p-3 dark:bg-slate-950/60">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-mint">
                {run.status}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{run.time}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{run.task}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActionPanel({
  title,
  icon: Icon,
  actions,
  loadTask
}: {
  title: string;
  icon: LucideIcon;
  actions: Array<{ label: string; task: string }>;
  loadTask: (task: string, view?: ViewKey) => void;
}) {
  return (
    <section className="rounded-xl border soft-border bg-white p-4 shadow-sm dark:bg-white/[0.04] sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-600 dark:text-mint">
          <Icon size={19} />
        </span>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="mt-4 grid gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => loadTask(action.task)}
            className="rounded-lg border soft-border bg-slate-50 p-3 text-left text-sm font-semibold transition hover:border-emerald-400 hover:text-emerald-600 dark:bg-slate-950/60 dark:hover:text-mint"
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function InsightCard({
  icon: Icon,
  title,
  lines
}: {
  icon: LucideIcon;
  title: string;
  lines: string[];
}) {
  return (
    <section className="rounded-xl border soft-border bg-white p-4 shadow-sm dark:bg-white/[0.04] sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-600 dark:text-mint">
          <Icon size={19} />
        </span>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">
        {lines.map((line) => (
          <div key={line} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <CheckCircle2 size={15} className="text-emerald-500" />
            {line}
          </div>
        ))}
      </div>
    </section>
  );
}

function ViewShell({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5 p-4 sm:p-6">
      <section className="rounded-xl border soft-border bg-white p-5 shadow-sm dark:bg-white/[0.04]">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-500">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
      </section>
      {children}
    </div>
  );
}

function Metric({
  label,
  value,
  trend,
  icon: Icon
}: {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border soft-border bg-white p-4 shadow-sm dark:bg-white/[0.04]">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-600 dark:text-mint">
          <Icon size={18} />
        </span>
        <span className="text-xs font-medium text-emerald-600 dark:text-mint">{trend}</span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
