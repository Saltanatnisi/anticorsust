import { notFound } from "next/navigation";
import { AGENCIES, getEntityByCode } from "@/lib/entities";
import { getPeriodByCode, LATEST_PERIOD } from "@/lib/periods";
import { computeEntityPeriodResult } from "@/lib/compute";
import { EntityDetailView } from "@/components/EntityDetailView";

export default async function AgencyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { code } = await params;
  const { period: periodCode } = await searchParams;
  const entity = getEntityByCode(code);
  if (!entity) notFound();

  const period = getPeriodByCode(periodCode ?? "") ?? LATEST_PERIOD;
  const result = computeEntityPeriodResult(entity, period);

  const ranking = AGENCIES.map((e) => ({ code: e.code, score: computeEntityPeriodResult(e, period).indexScore })).sort(
    (a, b) => b.score - a.score,
  );
  const rank = ranking.findIndex((r) => r.code === entity.code) + 1;

  return (
    <EntityDetailView
      result={result}
      backHref={`/agencies?period=${period.code}`}
      backLabel="Ко всем ведомствам"
      rank={rank}
      total={ranking.length}
    />
  );
}
