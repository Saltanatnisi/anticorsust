import type { Alert, EntityRecord, Period } from "./types";
import { computeEntityPeriodResult } from "./compute";
import { getPeriodByCode } from "./periods";

const LOW_SCORE_HIGH = 30;
const LOW_SCORE_MEDIUM = 45;
const DECLINE_THRESHOLD = 10;

/**
 * Формирует сигналы системы раннего предупреждения (гл. 7.5 методики):
 * критически низкие значения индикаторов и резкое ухудшение показателей
 * по сравнению с предыдущим периодом.
 */
export function generateAlerts(entities: EntityRecord[], period: Period): Alert[] {
  const alerts: Alert[] = [];
  const prevPeriod = getPeriodByCode(String(period.year - 1));

  for (const entity of entities) {
    const current = computeEntityPeriodResult(entity, period);
    const previous = prevPeriod ? computeEntityPeriodResult(entity, prevPeriod) : null;

    const previousByCode = new Map(
      previous?.blocks.flatMap((b) => b.indicators.map((i) => [i.indicator.indicator_code, i.normalizedScore] as const)) ?? [],
    );

    for (const block of current.blocks) {
      for (const ind of block.indicators) {
        if (ind.normalizedScore < LOW_SCORE_HIGH) {
          alerts.push({
            id: `low:${entity.code}:${period.code}:${ind.indicator.indicator_code}`,
            severity: "high",
            entityCode: entity.code,
            entityName: entity.name,
            periodCode: period.code,
            indicatorCode: ind.indicator.indicator_code,
            indicatorName: ind.indicator.indicator_name,
            blockName: block.name,
            message: `Критически низкое значение индикатора (${ind.normalizedScore.toFixed(1)} из 100)`,
            score: ind.normalizedScore,
          });
        } else if (ind.normalizedScore < LOW_SCORE_MEDIUM) {
          alerts.push({
            id: `medium:${entity.code}:${period.code}:${ind.indicator.indicator_code}`,
            severity: "medium",
            entityCode: entity.code,
            entityName: entity.name,
            periodCode: period.code,
            indicatorCode: ind.indicator.indicator_code,
            indicatorName: ind.indicator.indicator_name,
            blockName: block.name,
            message: `Повышенный риск по индикатору (${ind.normalizedScore.toFixed(1)} из 100)`,
            score: ind.normalizedScore,
          });
        }

        const prevScore = previousByCode.get(ind.indicator.indicator_code);
        if (prevScore !== undefined && prevScore - ind.normalizedScore >= DECLINE_THRESHOLD) {
          alerts.push({
            id: `decline:${entity.code}:${period.code}:${ind.indicator.indicator_code}`,
            severity: "medium",
            entityCode: entity.code,
            entityName: entity.name,
            periodCode: period.code,
            indicatorCode: ind.indicator.indicator_code,
            indicatorName: ind.indicator.indicator_name,
            blockName: block.name,
            message: `Резкое ухудшение по сравнению с ${prevPeriod?.label ?? "предыдущим периодом"}: ${prevScore.toFixed(1)} → ${ind.normalizedScore.toFixed(1)}`,
            score: ind.normalizedScore,
          });
        }
      }
    }
  }

  return alerts.sort((a, b) => a.score - b.score);
}
