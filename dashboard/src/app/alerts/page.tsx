import { COUNTRY, getRegionsAndCities, AGENCIES } from "@/lib/entities";
import { getPeriodByCode, LATEST_PERIOD } from "@/lib/periods";
import { generateAlerts } from "@/lib/alerts";
import { PeriodSelector } from "@/components/PeriodSelector";

const SEVERITY_STYLE: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

const SEVERITY_LABEL: Record<string, string> = {
  high: "Высокая",
  medium: "Средняя",
  low: "Низкая",
};

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodCode } = await searchParams;
  const period = getPeriodByCode(periodCode ?? "") ?? LATEST_PERIOD;

  const entities = [COUNTRY, ...getRegionsAndCities(), ...AGENCIES];
  const alerts = generateAlerts(entities, period);

  const high = alerts.filter((a) => a.severity === "high");
  const medium = alerts.filter((a) => a.severity === "medium");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Система раннего предупреждения</h1>
          <p className="text-sm text-slate-500 mt-1">
            Модуль 9 дашборда — автоматическое выявление критически низких значений и резкого ухудшения индикаторов
            (гл. 7.5 методики)
          </p>
        </div>
        <PeriodSelector current={period.code} />
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-400">Всего сигналов</div>
          <div className="text-2xl font-bold text-slate-800">{alerts.length}</div>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="text-xs text-red-500">Высокая критичность</div>
          <div className="text-2xl font-bold text-red-700">{high.length}</div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="text-xs text-amber-600">Средняя критичность</div>
          <div className="text-2xl font-bold text-amber-700">{medium.length}</div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="text-left text-xs text-slate-400 bg-slate-50">
              <th className="py-2 px-3 font-medium">Критичность</th>
              <th className="py-2 px-3 font-medium">Объект</th>
              <th className="py-2 px-3 font-medium">Индикатор</th>
              <th className="py-2 px-3 font-medium">Блок</th>
              <th className="py-2 px-3 font-medium">Сообщение</th>
              <th className="py-2 px-3 font-medium text-right">Балл</th>
            </tr>
          </thead>
          <tbody>
            {alerts.slice(0, 200).map((alert) => (
              <tr key={alert.id} className="border-t border-slate-100 hover:bg-slate-50 align-top">
                <td className="py-2 px-3">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${SEVERITY_STYLE[alert.severity]}`}>
                    {SEVERITY_LABEL[alert.severity]}
                  </span>
                </td>
                <td className="py-2 px-3 font-medium text-slate-700">{alert.entityName}</td>
                <td className="py-2 px-3">
                  <div className="font-mono text-xs text-slate-400">{alert.indicatorCode}</div>
                  <div className="text-slate-700">{alert.indicatorName}</div>
                </td>
                <td className="py-2 px-3 text-xs text-slate-500">{alert.blockName}</td>
                <td className="py-2 px-3 text-xs text-slate-500">{alert.message}</td>
                <td className="py-2 px-3 text-right font-semibold">{alert.score.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {alerts.length === 0 && <p className="p-6 text-sm text-slate-500">Активных сигналов не выявлено.</p>}
        {alerts.length > 200 && (
          <p className="p-3 text-xs text-slate-400">Показаны первые 200 из {alerts.length} сигналов.</p>
        )}
      </section>

      <p className="text-xs text-slate-400">
        Пороговые правила (демо): индикатор &lt; 30 баллов — высокая критичность; 30–45 баллов — средняя; падение
        индикатора на 10+ баллов год к году — дополнительный сигнал. Правила настраиваются в модуле{" "}
        <code className="bg-slate-100 px-1 rounded">src/lib/alerts.ts</code> и в production-версии должны
        конфигурироваться через административный интерфейс (см. Этап 7 плана разработки).
      </p>
    </div>
  );
}
