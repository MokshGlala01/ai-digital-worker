import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agent";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { task?: unknown };
    const task = typeof body.task === "string" ? body.task.trim() : "";

    if (!task) {
      return NextResponse.json(
        { error: "Task is required. Please describe what the digital worker should do." },
        { status: 400 }
      );
    }

    if (task.length > 1200) {
      return NextResponse.json(
        { error: "Task is too long. Keep the request under 1,200 characters." },
        { status: 400 }
      );
    }

    const response = await runAgent(task);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Agent route failed.", error);
    return NextResponse.json(
      { error: "The agent could not complete this task. Please try again." },
      { status: 500 }
    );
  }
}
