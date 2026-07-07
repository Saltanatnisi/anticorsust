import Link from "next/link";
import { AGENCIES } from "@/lib/entities";
import { getPeriodByCode, LATEST_PERIOD } from "@/lib/periods";
import { computeEntityPeriodResult } from "@/lib/compute";
import { PeriodSelector } from "@/components/PeriodSelector";
import { ScoreDot } from "@/components/ScoreBadge";
import { round1 } from "@/lib/calc";

export default async function AgenciesPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodCode } = await searchParams;
  const period = getPeriodByCode(periodCode ?? "") ?? LATEST_PERIOD;
  const periodQuery = `?period=${period.code}`;

  const ranking = AGENCIES.map((agency) => ({ agency, result: computeEntityPeriodResult(agency, period) })).sort(
    (a, b) => b.result.indexScore - a.result.indexScore,
  );

  const blockCodes = ranking[0]?.result.blocks.map((b) => b.code) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ведомственный рейтинг</h1>
          <p className="text-sm text-slate-500 mt-1">
            Модуль 3 дашборда — рейтинг государственных органов по устойчивости к коррупционным рискам (гл. 7.4
            методики)
          </p>
        </div>
        <PeriodSelector current={period.code} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs text-slate-400 bg-slate-50">
              <th className="py-2 px-4 font-medium">#</th>
              <th className="py-2 px-4 font-medium">Государственный орган</th>
              <th className="py-2 px-4 font-medium text-right">Индекс</th>
              {blockCodes.map((code) => (
                <th key={code} className="py-2 px-3 font-medium text-right">
                  Блок {code}
                </th>
              ))}
              <th className="py-2 px-4 font-medium">Уровень</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map(({ agency, result }, idx) => (
              <tr key={agency.code} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-4 text-slate-400">{idx + 1}</td>
                <td className="py-2 px-4">
                  <Link href={`/agencies/${agency.code}${periodQuery}`} className="font-medium text-emerald-700 hover:underline">
                    {agency.name}
                  </Link>
                </td>
                <td className="py-2 px-4 text-right font-semibold">{round1(result.indexScore)}</td>
                {result.blocks.map((b) => (
                  <td key={b.code} className="py-2 px-3 text-right text-slate-500">
                    {round1(b.score)}
                  </td>
                ))}
                <td className="py-2 px-4">
                  <span className="inline-flex items-center gap-1.5">
                    <ScoreDot level={result.zone} />
                    {result.zone.label.split(" — ")[1] ?? result.zone.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
