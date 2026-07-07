import Link from "next/link";
import type { EntityPeriodResult } from "@/lib/types";
import { PERIODS } from "@/lib/periods";
import { computeEntityPeriodResult, getBestIndicators, getWorstIndicators } from "@/lib/compute";
import { ScoreBadge } from "@/components/ScoreBadge";
import { PeriodSelector } from "@/components/PeriodSelector";
import { BlocksBarChart } from "@/components/charts/BlocksBarChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { IndicatorMiniList } from "@/components/IndicatorMiniList";
import { round1 } from "@/lib/calc";

export function EntityDetailView({
  result,
  backHref,
  backLabel,
  rank,
  total,
}: {
  result: EntityPeriodResult;
  backHref: string;
  backLabel: string;
  rank?: number;
  total?: number;
}) {
  const trend = PERIODS.map((p) => ({
    period: p.label.replace(" год", ""),
    score: round1(computeEntityPeriodResult(result.entity, p).indexScore),
  }));
  const worst = getWorstIndicators(result, 5);
  const best = getBestIndicators(result, 5);

  return (
    <div className="space-y-6">
      <div>
        <Link href={backHref} className="text-xs text-emerald-700 hover:underline">
          ← {backLabel}
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{result.entity.name}</h1>
            {rank !== undefined && total !== undefined && (
              <p className="text-sm text-slate-500 mt-1">
                Место {rank} из {total} · {result.period.label}
              </p>
            )}
          </div>
          <PeriodSelector current={result.period.code} />
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Индекс ИАУ</div>
          <div className="text-6xl font-extrabold" style={{ color: result.level.color }}>
            {round1(result.indexScore)}
          </div>
          <div className="mt-3">
            <ScoreBadge score={result.indexScore} level={result.level} size="lg" />
          </div>
        </div>
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Оценка по 7 функциональным блокам</h2>
          <BlocksBarChart blocks={result.blocks} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">Динамика Индекса по годам</h2>
        <TrendChart data={trend} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IndicatorMiniList title="Наиболее проблемные индикаторы" items={worst} tone="bad" />
        <IndicatorMiniList title="Наиболее сильные индикаторы" items={best} tone="good" />
      </section>
    </div>
  );
}
