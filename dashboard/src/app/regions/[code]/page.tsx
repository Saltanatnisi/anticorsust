import { notFound } from "next/navigation";
import { getRegionsAndCities, getEntityByCode } from "@/lib/entities";
import { getPeriodByCode, LATEST_PERIOD } from "@/lib/periods";
import { computeEntityPeriodResult } from "@/lib/compute";
import { EntityDetailView } from "@/components/EntityDetailView";

export default async function RegionDetailPage({
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

  const ranking = getRegionsAndCities()
    .map((e) => ({ code: e.code, score: computeEntityPeriodResult(e, period).indexScore }))
    .sort((a, b) => b.score - a.score);
  const rank = ranking.findIndex((r) => r.code === entity.code) + 1;

  return (
    <EntityDetailView
      result={result}
      backHref={`/regions?period=${period.code}`}
      backLabel="Ко всем регионам"
      rank={rank}
      total={ranking.length}
    />
  );
}
