const stack = ["Next.js 14", "App Router", "API Routes", "Tailwind CSS", "OpenAI-ready", "TypeScript"];

export function TechStack() {
  return (
    <section id="stack" className="border-y soft-border px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">Tech stack</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Built like a real SaaS product.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stack.map((item) => (
              <div key={item} className="rounded-lg border soft-border bg-white/70 px-4 py-3 text-sm font-medium dark:bg-white/[0.04]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
