# AI Task Automation Agent (Digital Worker)

A production-style AI SaaS app built with Next.js 14 App Router. The frontend and backend both live in the Next.js app.

## Structure

```text
frontend/
  app/              Pages and Next.js API routes
  app/api/agent/    Backend endpoint
  components/       UI components
  lib/agent.ts      AI agent abstraction and mock fallback
```

The older `backend/` Express folder is no longer required to run the website.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API

`POST http://localhost:3000/api/agent`

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

## Optional OpenAI Setup

Create `frontend/.env.local`:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

Without an API key, the app uses a deterministic mock agent.
