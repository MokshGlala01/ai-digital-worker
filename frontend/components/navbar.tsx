"use client";

import { Bot, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { href: "#features", label: "Features" },
  { href: "#demo", label: "Demo" },
  { href: "#stack", label: "Stack" },
  { href: "#pricing", label: "Pricing" }
];

export function Navbar() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b soft-border bg-white/72 backdrop-blur-xl dark:bg-[#060a12]/72">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-mint shadow-glow dark:bg-white">
            <Bot size={19} />
          </span>
          <span>Digital Worker</span>
        </a>

        <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-emerald-500">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle color mode"
            onClick={() => setIsDark((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border soft-border text-slate-700 transition hover:border-emerald-400 hover:text-emerald-500 dark:text-slate-200"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a
            href="#demo"
            className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 dark:bg-white dark:text-ink dark:hover:bg-mint"
          >
            Try Demo
          </a>
          <a
            href="/"
            className="hidden rounded-lg border soft-border px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-500 dark:text-slate-200 sm:inline-flex"
          >
            Log out
          </a>
        </div>
      </nav>
    </header>
  );
}
