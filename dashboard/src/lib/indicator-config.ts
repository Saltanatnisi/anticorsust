import type { IndicatorConfig } from "./types";

/**
 * Параметры нормирования (направленность, единица измерения, допустимый диапазон
 * Xmin–Xmax) для каждого из 57 индикаторов методики ИАУ.
 *
 * ВАЖНО: методическое пособие оставляет установление конкретных Xmin/Xmax и
 * направленности показателей на усмотрение экспертной комиссии (Приложение 2–3).
 * Значения ниже — обоснованные экспертные допущения для целей построения
 * работающего расчётного движка и демонстрационного дашборда. Перед вводом в
 * промышленную эксплуатацию их необходимо утвердить/скорректировать вместе с
 * авторами методики (см. «Открытые вопросы» в docs/DASHBOARD_PLAN.md).
 */
export const INDICATOR_CONFIG: Record<string, IndicatorConfig> = {
  // Блок I — Распространенность коррупции
  "a.1.1": { direction: "negative", unit: "%", xMin: 0, xMax: 100 },
  "a.1.2": { direction: "negative", unit: "%", xMin: 0, xMax: 100 },
  "a.1.3": { direction: "negative", unit: "USD (средний размер)", xMin: 0, xMax: 500 },
  "a.1.4": { direction: "negative", unit: "%", xMin: 0, xMax: 100 },
  "a.1.5": { direction: "positive", unit: "%", xMin: 0, xMax: 100 },
  "a.1.6": { direction: "positive", unit: "%", xMin: 0, xMax: 100 },

  // Блок II — Эффективность уголовного преследования
  "a.1.7": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "a.1.8": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "a.1.9": { direction: "positive", unit: "случаев на 100 тыс. нас.", xMin: 0, xMax: 20 },
  "a.1.10": { direction: "positive", unit: "случаев на 100 тыс. нас.", xMin: 0, xMax: 15 },
  "a.1.11": { direction: "positive", unit: "случаев на 100 тыс. нас.", xMin: 0, xMax: 10 },
  "a.1.12": { direction: "positive", unit: "случаев на 100 тыс. нас.", xMin: 0, xMax: 8 },
  "a.1.13": { direction: "positive", unit: "тыс. USD", xMin: 0, xMax: 1000 },
  "a.1.14": { direction: "positive", unit: "количество", xMin: 0, xMax: 200 },

  // Блок III — Защита государственных финансов
  "a.2.1": { direction: "negative", unit: "%", xMin: 0, xMax: 100 },
  "a.2.2": { direction: "negative", unit: "%", xMin: 0, xMax: 100 },
  "a.2.3": { direction: "positive", unit: "кол-во проверок", xMin: 0, xMax: 100 },
  "a.2.4": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "a.2.5": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "a.2.6": { direction: "positive", unit: "случаев на 100 тыс. нас.", xMin: 0, xMax: 10 },
  "a.2.7": { direction: "positive", unit: "случаев на 100 тыс. нас.", xMin: 0, xMax: 8 },
  "a.2.8": { direction: "positive", unit: "случаев на 100 тыс. нас.", xMin: 0, xMax: 6 },
  "a.2.9": { direction: "positive", unit: "тыс. USD", xMin: 0, xMax: 2000 },
  "a.2.10": { direction: "positive", unit: "количество", xMin: 0, xMax: 150 },

  // Блок IV — Система предупреждения коррупции
  "b.1.1": { direction: "negative", unit: "%", xMin: 0, xMax: 100 },
  "b.1.2": { direction: "negative", unit: "%", xMin: 0, xMax: 100 },
  "b.1.3": { direction: "negative", unit: "%", xMin: 0, xMax: 100 },
  "b.1.4": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "b.1.5": { direction: "positive", unit: "‰ (на 1000 случаев)", xMin: 0, xMax: 1000 },
  "b.1.6": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "b.1.7": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "b.1.8": { direction: "negative", unit: "‰ (на 1000 назначений)", xMin: 0, xMax: 100 },
  "b.1.9": { direction: "negative", unit: "‰ (на 1000 процедур)", xMin: 0, xMax: 50 },

  // Блок V — Управление конфликтом интересов
  "b.3.1": { direction: "negative", unit: "на 1000 должностных лиц", xMin: 0, xMax: 50 },
  "b.3.2": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "b.3.3": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "b.3.4": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "b.3.5": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "b.3.6": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "b.3.7": { direction: "positive", unit: "%", xMin: 0, xMax: 100 },

  // Блок VI — Государственные закупки
  "b.5.1": { direction: "negative", unit: "%", xMin: 0, xMax: 100 },
  "b.5.2": { direction: "positive", unit: "%", xMin: 0, xMax: 100 },
  "b.5.3": { direction: "positive", unit: "балл (0–2)", xMin: 0, xMax: 2 },
  "b.5.4": { direction: "positive", unit: "балл (0–5)", xMin: 0, xMax: 5 },
  "b.5.5": { direction: "positive", unit: "балл соответствия, %", xMin: 0, xMax: 100 },
  "b.5.6": { direction: "positive", unit: "% соответствия", xMin: 0, xMax: 100 },
  "b.5.7": { direction: "positive", unit: "%", xMin: 0, xMax: 100 },
  "b.5.8": { direction: "positive", unit: "количество", xMin: 0, xMax: 100 },

  // Блок VII — Открытость государства и общественный контроль
  "c.2.1": { direction: "positive", unit: "% удовлетворённых запросов", xMin: 0, xMax: 100 },
  "c.2.2": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "c.2.3": { direction: "negative", unit: "%", xMin: 0, xMax: 100 },
  "c.2.4": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "c.2.5": { direction: "positive", unit: "индекс (0–100)", xMin: 0, xMax: 100 },
  "c.2.6": { direction: "positive", unit: "индекс (0–100)", xMin: 0, xMax: 100 },
  "c.2.7": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "c.2.8": { direction: "positive", unit: "бинарный (0/1)", xMin: 0, xMax: 1 },
  "c.2.9": { direction: "positive", unit: "%", xMin: 0, xMax: 100 },
};

export function getIndicatorConfig(code: string): IndicatorConfig {
  const cfg = INDICATOR_CONFIG[code];
  if (!cfg) {
    throw new Error(`Не найдена конфигурация нормирования для индикатора ${code}`);
  }
  return cfg;
}
