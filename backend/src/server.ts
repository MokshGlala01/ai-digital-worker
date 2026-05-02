import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { runAgent } from "./agent.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";

app.use(
  cors({
    origin: frontendOrigin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_request: Request, response: Response) => {
  response.json({ ok: true, service: "ai-task-automation-agent-backend" });
});

app.post("/api/agent", async (request: Request, response: Response) => {
  try {
    const task = typeof request.body?.task === "string" ? request.body.task.trim() : "";

    if (!task) {
      response.status(400).json({
        error: "Task is required. Please describe what the digital worker should do."
      });
      return;
    }

    if (task.length > 1200) {
      response.status(400).json({
        error: "Task is too long. Keep the request under 1,200 characters."
      });
      return;
    }

    const agentResponse = await runAgent(task);
    response.json(agentResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    response.status(500).json({ error: message });
  }
});

app.use((_request: Request, response: Response) => {
  response.status(404).json({ error: "Route not found." });
});

app.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`);
});
