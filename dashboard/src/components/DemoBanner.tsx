export function DemoBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center gap-2">
        <span className="font-semibold">⚠ Демонстрационные данные.</span>
        <span>
          Реестр из 57 индикаторов и структура блоков соответствуют методике ИАУ, но фактические статистические
          значения по Кыргызстану пока не подтверждены как доступные — показаны иллюстративные (синтетические)
          данные для демонстрации расчётного движка и интерфейса.
        </span>
      </div>
    </div>
  );
}
