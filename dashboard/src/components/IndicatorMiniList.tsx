import type { IndicatorResult } from "@/lib/types";
import { round1 } from "@/lib/calc";

export function IndicatorMiniList({ title, items, tone }: { title: string; items: IndicatorResult[]; tone: "bad" | "good" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.indicator.indicator_code} className="flex items-start justify-between gap-3 text-sm">
            <div className="min-w-0">
              <div className="font-mono text-xs text-slate-400">{item.indicator.indicator_code}</div>
              <div className="text-slate-700 leading-snug">{item.indicator.indicator_name}</div>
              <div className="text-xs text-slate-400">Блок {item.indicator.block_code} · {item.indicator.block_name}</div>
            </div>
            <span
              className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${
                tone === "bad" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {round1(item.normalizedScore)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
