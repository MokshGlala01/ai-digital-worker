export type AgentStep = {
  id: string;
  title: string;
  detail: string;
  tool: "Planner" | "Email" | "Calendar" | "Data" | "Workflow" | "Audit";
  status: "completed";
};

export type AgentResponse = {
  steps: AgentStep[];
  result: string;
  mode: "openai" | "mock";
};

const fallbackSteps: AgentStep[] = [
  {
    id: "plan",
    title: "Interpreted request",
    detail: "Identified the business outcome, required tools, urgency, and any missing context.",
    tool: "Planner",
    status: "completed"
  },
  {
    id: "email",
    title: "Checked communication context",
    detail: "Scanned simulated inbox threads for participants, open decisions, attachments, and timing constraints.",
    tool: "Email",
    status: "completed"
  },
  {
    id: "calendar",
    title: "Matched available windows",
    detail: "Compared stakeholder availability and selected the earliest slot that avoids conflicts.",
    tool: "Calendar",
    status: "completed"
  },
  {
    id: "data",
    title: "Updated operational records",
    detail: "Prepared CRM and task metadata so follow-up work has owners, dates, and traceable notes.",
    tool: "Data",
    status: "completed"
  },
  {
    id: "workflow",
    title: "Executed workflow",
    detail: "Drafted messages, scheduled the event, assigned next actions, and queued reminders.",
    tool: "Workflow",
    status: "completed"
  },
  {
    id: "audit",
    title: "Recorded audit trail",
    detail: "Stored the task summary, tool calls, decision rationale, and final status for review.",
    tool: "Audit",
    status: "completed"
  }
];

export async function runAgent(task: string): Promise<AgentResponse> {
  if (process.env.OPENAI_API_KEY) {
    return runOpenAIAgent(task);
  }

  return runMockAgent(task);
}

function runMockAgent(task: string): AgentResponse {
  const normalizedTask = task.replace(/\s+/g, " ").trim();
  const inferredAction = inferAction(normalizedTask);

  return {
    steps: fallbackSteps,
    result: `Completed: ${inferredAction}. I processed "${normalizedTask}", coordinated the relevant email/calendar/data workflow, and produced an auditable execution trace with owners, timing, and next steps.`,
    mode: "mock"
  };
}

async function runOpenAIAgent(task: string): Promise<AgentResponse> {
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an enterprise digital worker. Return strict JSON with keys steps and result. steps must be an array of 5-7 objects with id, title, detail, tool, and status. tool must be one of Planner, Email, Calendar, Data, Workflow, Audit. status must be completed. Simulate tool use clearly without claiming real-world actions were actually performed."
        },
        {
          role: "user",
          content: `Task: ${task}`
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${errorText}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  const parsed = JSON.parse(content) as Partial<AgentResponse>;
  const steps = normalizeSteps(parsed.steps);

  return {
    steps,
    result:
      typeof parsed.result === "string" && parsed.result.trim()
        ? parsed.result.trim()
        : "The digital worker completed the requested workflow and recorded the execution trace.",
    mode: "openai"
  };
}

function normalizeSteps(value: unknown): AgentStep[] {
  if (!Array.isArray(value)) {
    return fallbackSteps;
  }

  const allowedTools = new Set<AgentStep["tool"]>([
    "Planner",
    "Email",
    "Calendar",
    "Data",
    "Workflow",
    "Audit"
  ]);

  const steps = value
    .slice(0, 7)
    .map((step, index) => {
      const item = step as Partial<AgentStep>;
      const tool = item.tool && allowedTools.has(item.tool) ? item.tool : "Workflow";

      return {
        id: typeof item.id === "string" ? item.id : `step-${index + 1}`,
        title: typeof item.title === "string" ? item.title : `Step ${index + 1}`,
        detail:
          typeof item.detail === "string"
            ? item.detail
            : "Completed a simulated tool operation for the requested workflow.",
        tool,
        status: "completed" as const
      };
    })
    .filter((step) => step.title.trim() && step.detail.trim());

  return steps.length ? steps : fallbackSteps;
}

function inferAction(task: string) {
  const lower = task.toLowerCase();

  if (lower.includes("email") && lower.includes("meeting")) {
    return "reviewed email context and scheduled the best meeting slot";
  }

  if (lower.includes("invoice") || lower.includes("spreadsheet") || lower.includes("data")) {
    return "extracted task data, updated records, and prepared follow-up actions";
  }

  if (lower.includes("calendar") || lower.includes("schedule")) {
    return "coordinated calendar availability and created a scheduling plan";
  }

  if (lower.includes("follow up") || lower.includes("follow-up")) {
    return "created a follow-up workflow with messaging, timing, and audit notes";
  }

  return "planned and executed a multi-step business workflow";
}
