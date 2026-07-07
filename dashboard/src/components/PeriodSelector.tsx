"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PERIODS } from "@/lib/periods";

export function PeriodSelector({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-600">
      Период:
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium text-slate-800 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
      >
        {PERIODS.map((p) => (
          <option key={p.code} value={p.code}>
            {p.label}
          </option>
        ))}
      </select>
    </label>
  );
}
