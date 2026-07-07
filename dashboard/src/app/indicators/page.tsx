import Link from "next/link";
import { getBlocks, getIndicators, getRegistryMeta } from "@/lib/registry";

export default async function IndicatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ block?: string; q?: string }>;
}) {
  const { block: blockFilter, q } = await searchParams;
  const blocks = getBlocks();
  const meta = getRegistryMeta();
  const allIndicators = getIndicators();

  const query = (q ?? "").trim().toLowerCase();
  const filtered = allIndicators.filter((ind) => {
    const matchesBlock = !blockFilter || blockFilter === "all" || ind.block_code === blockFilter;
    const matchesQuery =
      !query ||
      ind.indicator_name.toLowerCase().includes(query) ||
      ind.indicator_code.toLowerCase().includes(query) ||
      ind.unodc_aspect.toLowerCase().includes(query);
    return matchesBlock && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Реестр индикаторов ИАУ</h1>
        <p className="text-sm text-slate-500 mt-1">
          57 статистических индикаторов, сгруппированных по 7 функциональным блокам (Приложение 1 методики).
          Подтверждена доступность данных в Кыргызстане: {meta.available_in_kg_count} из {meta.total_indicators}.
        </p>
      </div>

      <form className="flex flex-wrap gap-3 items-end rounded-xl border border-slate-200 bg-white p-4" method="get">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500" htmlFor="block">
            Блок
          </label>
          <select
            id="block"
            name="block"
            defaultValue={blockFilter ?? "all"}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          >
            <option value="all">Все блоки</option>
            {blocks.map((b) => (
              <option key={b.code} value={b.code}>
                Блок {b.code} — {b.name} ({Math.round(b.weight * 100)}%)
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs text-slate-500" htmlFor="q">
            Поиск по названию или коду
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q ?? ""}
            placeholder="например: закупки, подкуп, a.1.7…"
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <button type="submit" className="rounded-md bg-emerald-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-800">
          Найти
        </button>
        {(blockFilter || q) && (
          <Link href="/indicators" className="text-sm text-slate-500 hover:underline">
            Сбросить
          </Link>
        )}
      </form>

      <section className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="text-left text-xs text-slate-400 bg-slate-50">
              <th className="py-2 px-3 font-medium">Код</th>
              <th className="py-2 px-3 font-medium">Индикатор</th>
              <th className="py-2 px-3 font-medium">Блок</th>
              <th className="py-2 px-3 font-medium">Тип источника</th>
              <th className="py-2 px-3 font-medium">Направленность</th>
              <th className="py-2 px-3 font-medium">Доступность в КР</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ind) => (
              <tr key={ind.indicator_code} className="border-t border-slate-100 align-top hover:bg-slate-50">
                <td className="py-2 px-3 font-mono text-xs text-slate-500 whitespace-nowrap">{ind.indicator_code}</td>
                <td className="py-2 px-3">
                  <div className="font-medium text-slate-800">{ind.indicator_name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{ind.unodc_aspect}</div>
                  {ind.calculation_method && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs text-emerald-700">Метод расчёта</summary>
                      <p className="text-xs text-slate-500 mt-1 whitespace-pre-line">{ind.calculation_method}</p>
                    </details>
                  )}
                </td>
                <td className="py-2 px-3 whitespace-nowrap">
                  <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {ind.block_code}
                  </span>
                  <div className="text-xs text-slate-400 mt-1 max-w-[160px]">{ind.block_name}</div>
                </td>
                <td className="py-2 px-3 text-xs text-slate-500 whitespace-nowrap">{ind.source_type || "—"}</td>
                <td className="py-2 px-3 text-xs whitespace-nowrap">
                  <span
                    className={`rounded-md px-2 py-0.5 font-medium ${
                      ind.direction === "positive" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {ind.direction === "positive" ? "рост = лучше" : "рост = хуже"}
                  </span>
                  <div className="text-slate-400 mt-1">{ind.unit}</div>
                </td>
                <td className="py-2 px-3 text-xs whitespace-nowrap">
                  {ind.available_in_kg ? (
                    <span className="text-emerald-700 font-medium">Подтверждена</span>
                  ) : (
                    <span className="text-amber-600 font-medium">Требует сбора</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-sm text-slate-500">Индикаторы не найдены.</p>}
      </section>
    </div>
  );
}
