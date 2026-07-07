import type { BlockResult, EntityPeriodResult, EntityRecord, IndicatorResult, Period } from "./types";
import { getBlocks } from "./registry";
import { getDemoRawValue } from "./demo-data";
import { INDEX_LEVELS, MAP_ZONES, interpret, normalizeIndicatorValue, weightedAverage } from "./calc";

export function computeEntityPeriodResult(entity: EntityRecord, period: Period): EntityPeriodResult {
  const blocks = getBlocks();

  const blockResults: BlockResult[] = blocks.map((block) => {
    const indicatorResults: IndicatorResult[] = block.indicators.map((indicator) => {
      const rawValue = getDemoRawValue(indicator, entity, period);
      const normalizedScore = normalizeIndicatorValue(indicator, rawValue);
      return { indicator, rawValue, normalizedScore };
    });

    const score = weightedAverage(
      indicatorResults.map((r) => ({ score: r.normalizedScore, weight: r.indicator.weightInBlock })),
    );

    return {
      code: block.code,
      name: block.name,
      weight: block.weight,
      score,
      indicators: indicatorResults,
    };
  });

  const indexScore = weightedAverage(blockResults.map((b) => ({ score: b.score, weight: b.weight })));

  return {
    entity,
    period,
    indexScore,
    level: interpret(indexScore, INDEX_LEVELS),
    zone: interpret(indexScore, MAP_ZONES),
    blocks: blockResults,
  };
}

export function getWorstIndicators(result: EntityPeriodResult, count = 5): IndicatorResult[] {
  return result.blocks
    .flatMap((b) => b.indicators)
    .slice()
    .sort((a, b) => a.normalizedScore - b.normalizedScore)
    .slice(0, count);
}

export function getBestIndicators(result: EntityPeriodResult, count = 5): IndicatorResult[] {
  return result.blocks
    .flatMap((b) => b.indicators)
    .slice()
    .sort((a, b) => b.normalizedScore - a.normalizedScore)
    .slice(0, count);
}
