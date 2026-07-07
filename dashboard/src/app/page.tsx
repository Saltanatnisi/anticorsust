import { COUNTRY } from "@/lib/entities";
import { PERIODS, getPeriodByCode, LATEST_PERIOD } from "@/lib/periods";
import { computeEntityPeriodResult, getBestIndicators, getWorstIndicators } from "@/lib/compute";
import { ScoreBadge } from "@/components/ScoreBadge";
import { PeriodSelector } from "@/components/PeriodSelector";
import { BlocksBarChart } from "@/components/charts/BlocksBarChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { IndicatorMiniList } from "@/components/IndicatorMiniList";
import { round1 } from "@/lib/calc";
import Link from "next/link";

export default async function NationalDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodCode } = await searchParams;
  const period = getPeriodByCode(periodCode ?? "") ?? LATEST_PERIOD;

  const result = computeEntityPeriodResult(COUNTRY, period);
  const trend = PERIODS.map((p) => ({
    period: p.label.replace(" год", ""),
    score: round1(computeEntityPeriodResult(COUNTRY, p).indexScore),
  }));

  const worst = getWorstIndicators(result, 5);
  const best = getBestIndicators(result, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Национальная панель ИАУ</h1>
          <p className="text-sm text-slate-500 mt-1">
            Индекс антикоррупционной устойчивости Кыргызской Республики — модуль 1 дашборда (гл. 7.6 методики)
          </p>
        </div>
        <PeriodSelector current={period.code} />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Итоговый Индекс за {period.label}</div>
          <div className="text-6xl font-extrabold" style={{ color: result.level.color }}>
            {round1(result.indexScore)}
          </div>
          <div className="mt-3">
            <ScoreBadge score={result.indexScore} level={result.level} size="lg" />
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Шкала интерпретации: 90–100 очень высокий · 80–89 высокий · 70–79 достаточный · 60–69 умеренный ·
            50–59 повышенный риск · 40–49 высокий риск · &lt;40 критический (п. 5.5 методики)
          </p>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Оценка по 7 функциональным блокам</h2>
          <BlocksBarChart blocks={result.blocks} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Динамика Индекса по годам</h2>
          <TrendChart data={trend} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Структура блоков и весов</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="py-1.5 font-medium">Блок</th>
                <th className="py-1.5 font-medium text-right">Вес</th>
                <th className="py-1.5 font-medium text-right">Балл</th>
              </tr>
            </thead>
            <tbody>
              {result.blocks.map((b) => (
                <tr key={b.code} className="border-b border-slate-50 last:border-0">
                  <td className="py-1.5 pr-2 text-slate-700">
                    <span className="font-mono text-xs text-slate-400 mr-1">{b.code}</span>
                    {b.name}
                  </td>
                  <td className="py-1.5 text-right text-slate-500">{Math.round(b.weight * 100)}%</td>
                  <td className="py-1.5 text-right font-semibold" style={{ color: b.score < 60 ? "#dc2626" : "#0f172a" }}>
                    {round1(b.score)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IndicatorMiniList title="Наиболее проблемные индикаторы (страна)" items={worst} tone="bad" />
        <IndicatorMiniList title="Наиболее сильные индикаторы (страна)" items={best} tone="good" />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Подробные данные по регионам и ведомствам доступны в разделах{" "}
        <Link href="/regions" className="text-emerald-700 font-medium hover:underline">
          «Регионы»
        </Link>{" "}
        и{" "}
        <Link href="/agencies" className="text-emerald-700 font-medium hover:underline">
          «Ведомства»
        </Link>
        . Полный реестр 57 индикаторов с паспортами — в разделе{" "}
        <Link href="/indicators" className="text-emerald-700 font-medium hover:underline">
          «Реестр индикаторов»
        </Link>
        .
      </section>
    </div>
  );
}
