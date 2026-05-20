import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "teal" | "amber" | "red" | "slate";
};

const toneClass = {
  teal: "bg-teal-50 text-teal-700 ring-teal-100",
  amber: "bg-amber-100 text-amber-700 ring-amber-100",
  red: "bg-red-50 text-danger ring-red-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200"
};

export function Badge({ children, tone = "slate" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${toneClass[tone]}`}>
      {children}
    </span>
  );
}
