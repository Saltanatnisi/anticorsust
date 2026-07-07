import type { EntityRecord, Indicator, Period } from "./types";
import { seededRandom } from "./prng";
import { clamp } from "./calc";

/**
 * ГЕНЕРАТОР ДЕМОНСТРАЦИОННЫХ ДАННЫХ.
 *
 * Реальные значения индикаторов по Кыргызстану пока не подтверждены как
 * доступные (см. data/indicators_registry.json — available_in_kg: false по
 * всем 57 показателям). Чтобы дашборд можно было содержательно
 * продемонстрировать и протестировать расчётный движок, здесь генерируются
 * детерминированные иллюстративные («демо») значения.
 *
 * Логика генерации: каждой сущности присваивается скрытый «истинный» уровень
 * устойчивости (latent score, 0–100), который улучшается год к году (тренд) и
 * варьируется шумом на уровне отдельного индикатора. Из latent-значения
 * получается нормированный балл индикатора, который затем конвертируется в
 * «сырое» значение в реальной шкале индикатора (Xmin–Xmax) с учётом
 * направленности (позитив/негатив). Расчётный движок (lib/calc.ts) далее
 * заново нормирует эти «сырые» значения по формулам методики — то есть
 * полный цикл расчёта работает точно так же, как будет работать с реальными
 * статистическими данными после их сбора.
 *
 * Эти данные ЗАМЕНЯЮТСЯ реальной статистикой на этапе 0–1 плана
 * (docs/DASHBOARD_PLAN.md) без изменения логики движка.
 */

const YEAR_TREND_PER_YEAR = 2.2; // иллюстративный ежегодный прогресс, баллов
const BASE_YEAR = 2023;

function baseLatentForEntity(entityCode: string): number {
  // Разброс базового уровня устойчивости в диапазоне [38, 82]
  return seededRandom(`base:${entityCode}`)() * 44 + 38;
}

function latentScore(entity: EntityRecord, period: Period): number {
  const base = baseLatentForEntity(entity.code);
  const trend = YEAR_TREND_PER_YEAR * (period.year - BASE_YEAR);
  const periodNoise = (seededRandom(`period-noise:${entity.code}:${period.code}`)() - 0.5) * 4;
  return clamp(base + trend + periodNoise, 5, 97);
}

/**
 * Возвращает детерминированное демонстрационное «сырое» значение индикатора
 * для заданной сущности и периода.
 */
export function getDemoRawValue(indicator: Indicator, entity: EntityRecord, period: Period): number {
  const latent = latentScore(entity, period);
  const rng = seededRandom(`value:${indicator.indicator_code}:${entity.code}:${period.code}`);
  const noise = (rng() - 0.5) * 12;
  const targetNormScore = clamp(latent + noise, 1, 99);

  const { xMin, xMax, direction } = indicator;

  // Бинарные индикаторы (0/1) — детерминированный порог от целевого нормированного балла
  // (без вероятностного сэмплирования, чтобы избежать резких немотивированных скачков
  // тренда между периодами при небольшом числе бинарных показателей в блоке)
  if (xMax - xMin === 1) {
    const above = targetNormScore >= 50;
    return direction === "positive" ? (above ? 1 : 0) : above ? 0 : 1;
  }

  const raw =
    direction === "positive"
      ? xMin + (targetNormScore / 100) * (xMax - xMin)
      : xMax - (targetNormScore / 100) * (xMax - xMin);

  return Math.round(raw * 100) / 100;
}
