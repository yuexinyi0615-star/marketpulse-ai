import Link from "next/link";
import type { ReactNode } from "react";
import { getDataModeLabel } from "@/lib/supabase";

const navItems = [
  ["Home", "/"],
  ["Market", "/market"],
  ["News Impact", "/news-impact"],
  ["Company Search", "/company-search"],
  ["Reports", "/reports"],
  ["Learning", "/learning"],
  ["Admin", "/admin"]
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-teal-100 text-sm font-black text-teal-700">MP</span>
            <span>
              <strong className="block text-lg font-black">MarketPulse AI</strong>
              <small className="block text-xs font-bold text-muted">{getDataModeLabel()}</small>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm font-bold text-slate-700" aria-label="Primary navigation">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-lg px-3 py-2 hover:bg-teal-50 hover:text-teal-700">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>
    </div>
  );
}
