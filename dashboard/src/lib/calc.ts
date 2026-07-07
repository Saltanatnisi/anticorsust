import type { Indicator, InterpretationLevel } from "./types";

/**
 * Расчётный движок Индекса антикоррупционной устойчивости (ИАУ).
 * Формулы соответствуют главе 5 методического пособия:
 *
 *   Позитивный индикатор:  Иij = (Xij − Xmin) / (Xmax − Xmin) × 100
 *   Негативный индикатор:  Иij = (Xmax − Xij) / (Xmax − Xmin) × 100
 *   Блок:                  Бi  = Σ (Иij × Wij),  Σ Wij = 1
 *   Индекс:                ИАУ = Σ (Бi × Wi),    Σ Wi  = 1
 */

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

/** Нормирует «сырое» значение индикатора в шкалу 0–100 согласно методике. */
export function normalizeIndicatorValue(indicator: Indicator, rawValue: number): number {
  const { xMin, xMax, direction } = indicator;

  if (xMax === xMin) {
    // «Если значение Xmax равно Xmin, нормализация не применяется» (п. 5.4 методики)
    return 50;
  }

  const ratio =
    direction === "positive"
      ? (rawValue - xMin) / (xMax - xMin)
      : (xMax - rawValue) / (xMax - xMin);

  return clamp(ratio * 100);
}

export interface WeightedScore {
  score: number;
  weight: number;
}

/** Средневзвешенное значение блока/индекса: Σ(score×weight) / Σweight (страхует от неточной суммы весов). */
export function weightedAverage(items: WeightedScore[]): number {
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  if (totalWeight === 0) return 0;
  const total = items.reduce((sum, i) => sum + i.score * i.weight, 0);
  return total / totalWeight;
}

/** Детальная 7-уровневая шкала интерпретации итогового значения ИАУ (п. 5.5 методики). */
export const INDEX_LEVELS: InterpretationLevel[] = [
  { label: "Очень высокий", min: 90, max: 100, color: "#15803d", textColor: "#ffffff" },
  { label: "Высокий", min: 80, max: 89.999, color: "#22c55e", textColor: "#052e16" },
  { label: "Достаточный", min: 70, max: 79.999, color: "#84cc16", textColor: "#1a2e05" },
  { label: "Умеренный", min: 60, max: 69.999, color: "#eab308", textColor: "#422006" },
  { label: "Повышенный риск", min: 50, max: 59.999, color: "#f97316", textColor: "#431407" },
  { label: "Высокий риск", min: 40, max: 49.999, color: "#ef4444", textColor: "#ffffff" },
  { label: "Критический", min: 0, max: 39.999, color: "#991b1b", textColor: "#ffffff" },
];

/** Упрощённая 4-зонная шкала для карты регионов (п. 7.3 методики). */
export const MAP_ZONES: InterpretationLevel[] = [
  { label: "Зелёная зона — высокий уровень устойчивости", min: 80, max: 100, color: "#22c55e", textColor: "#052e16" },
  { label: "Жёлтая зона — управляемый риск", min: 60, max: 79.999, color: "#eab308", textColor: "#422006" },
  { label: "Оранжевая зона — повышенный риск", min: 40, max: 59.999, color: "#f97316", textColor: "#431407" },
  { label: "Красная зона — критическая уязвимость", min: 0, max: 39.999, color: "#dc2626", textColor: "#ffffff" },
];

export function interpret(score: number, scale: InterpretationLevel[]): InterpretationLevel {
  return scale.find((level) => score >= level.min && score <= level.max) ?? scale[scale.length - 1];
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
