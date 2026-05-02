<<<<<<< HEAD
# AI Task Automation Agent (Digital Worker)

A production-style AI SaaS demo with separate frontend and backend folders.

## Folder structure

```text
frontend/   Next.js 14 App Router UI
backend/    Express REST API and agent logic
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The frontend runs on `http://localhost:3000`.
The backend runs on `http://localhost:4000`.

## API

`POST http://localhost:4000/api/agent`

```json
{
  "task": "Check emails and schedule a meeting"
}
```

Response:

```json
{
  "steps": [],
  "result": "Completed workflow summary",
  "mode": "mock"
}
```

## Optional OpenAI setup

Create `backend/.env`:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

Without an API key, the app uses a deterministic mock agent that simulates email, calendar, data, workflow, audit, and final response steps.
=======
# AI-digital-worker
>>>>>>> 834afe4cf9dc4e46cf837362ba3702bb725e9e78
