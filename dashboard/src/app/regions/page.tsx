import Link from "next/link";
import { REGIONS, CITIES } from "@/lib/entities";
import { getPeriodByCode, LATEST_PERIOD } from "@/lib/periods";
import { computeEntityPeriodResult } from "@/lib/compute";
import { getRegionPaths, projectPoint } from "@/lib/geo";
import { PeriodSelector } from "@/components/PeriodSelector";
import { MapLegend } from "@/components/MapLegend";
import { RegionsMapClient, type MapCityDatum, type MapRegionDatum } from "@/components/RegionsMapClient";
import { round1 } from "@/lib/calc";
import { ScoreDot } from "@/components/ScoreBadge";

export default async function RegionsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodCode } = await searchParams;
  const period = getPeriodByCode(periodCode ?? "") ?? LATEST_PERIOD;
  const periodQuery = `?period=${period.code}`;

  const regionResults = REGIONS.map((region) => ({ region, result: computeEntityPeriodResult(region, period) }));
  const cityResults = CITIES.map((city) => ({ city, result: computeEntityPeriodResult(city, period) }));

  const paths = getRegionPaths();
  const mapRegions: MapRegionDatum[] = paths.map((p) => {
    const found = regionResults.find((r) => r.region.shapeISO === p.shapeISO);
    return {
      code: found?.region.code ?? p.shapeISO,
      name: found?.region.name ?? p.shapeName,
      path: p.path,
      score: found?.result.indexScore ?? 0,
      color: found?.result.zone.color ?? "#cbd5e1",
    };
  });

  const mapCities: MapCityDatum[] = cityResults.map(({ city, result }) => {
    const point = city.lon && city.lat ? projectPoint(city.lon, city.lat) : null;
    return {
      code: city.code,
      name: city.name,
      x: point?.[0] ?? 0,
      y: point?.[1] ?? 0,
      score: result.indexScore,
      color: result.zone.color,
    };
  });

  const ranking = [...regionResults.map((r) => ({ entity: r.region, result: r.result })), ...cityResults.map((c) => ({ entity: c.city, result: c.result }))].sort(
    (a, b) => b.result.indexScore - a.result.indexScore,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Региональная карта рисков</h1>
          <p className="text-sm text-slate-500 mt-1">
            Модуль 2 дашборда — интерактивная карта Кыргызстана с рейтингом областей и городов (гл. 7.3 методики)
          </p>
        </div>
        <PeriodSelector current={period.code} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="text-sm font-semibold text-slate-700">Карта регионов — {period.label}</h2>
          <MapLegend />
        </div>
        <RegionsMapClient regions={mapRegions} cities={mapCities} periodQuery={periodQuery} />
        <p className="mt-2 text-xs text-slate-400">
          Границы областей: geoBoundaries (OpenStreetMap). Города Бишкек и Ош показаны точечными маркерами — отдельные
          полигоны городов республиканского значения будут добавлены при подключении детализированного слоя ГИС.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Рейтинг регионов и городов — {period.label}</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 bg-slate-50">
              <th className="py-2 px-4 font-medium">#</th>
              <th className="py-2 px-4 font-medium">Регион / город</th>
              <th className="py-2 px-4 font-medium text-right">Индекс ИАУ</th>
              <th className="py-2 px-4 font-medium">Уровень</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((row, idx) => (
              <tr key={row.entity.code} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-4 text-slate-400">{idx + 1}</td>
                <td className="py-2 px-4">
                  <Link href={`/regions/${row.entity.code}${periodQuery}`} className="font-medium text-emerald-700 hover:underline">
                    {row.entity.name}
                  </Link>
                </td>
                <td className="py-2 px-4 text-right font-semibold">{round1(row.result.indexScore)}</td>
                <td className="py-2 px-4">
                  <span className="inline-flex items-center gap-1.5">
                    <ScoreDot level={row.result.zone} />
                    {row.result.zone.label.split(" — ")[1] ?? row.result.zone.label}
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
