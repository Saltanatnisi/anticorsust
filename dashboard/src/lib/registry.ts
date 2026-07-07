import registryJson from "@/data/indicators-registry.json";
import type { Block, Indicator, RawIndicatorRecord } from "./types";
import { getIndicatorConfig } from "./indicator-config";

interface RegistryFile {
  meta: {
    total_indicators: number;
    available_in_kg_count: number;
    blocks_summary: Record<string, { block_name: string; block_weight: number; indicator_count: number }>;
  };
  indicators: RawIndicatorRecord[];
}

const registry = registryJson as unknown as RegistryFile;

function normalizeCode(code: string): string {
  return code.trim().replace(/\.$/, "");
}

let cachedIndicators: Indicator[] | null = null;

export function getIndicators(): Indicator[] {
  if (cachedIndicators) return cachedIndicators;

  const countByBlock = new Map<string, number>();
  for (const rec of registry.indicators) {
    countByBlock.set(rec.block_code, (countByBlock.get(rec.block_code) ?? 0) + 1);
  }

  cachedIndicators = registry.indicators.map((rec) => {
    const code = normalizeCode(rec.indicator_code);
    const config = getIndicatorConfig(code);
    const n = countByBlock.get(rec.block_code) ?? 1;
    return {
      ...rec,
      indicator_code: code,
      ...config,
      weightInBlock: 1 / n,
    };
  });

  return cachedIndicators;
}

export function getIndicatorByCode(code: string): Indicator | undefined {
  return getIndicators().find((i) => i.indicator_code === code);
}

const BLOCK_ORDER = ["I", "II", "III", "IV", "V", "VI", "VII"];

export function getBlocks(): Block[] {
  const indicators = getIndicators();
  return BLOCK_ORDER.map((code) => {
    const blockIndicators = indicators.filter((i) => i.block_code === code);
    const meta = registry.meta.blocks_summary[code];
    return {
      code,
      name: meta.block_name,
      weight: meta.block_weight,
      indicators: blockIndicators,
    };
  });
}

export function getRegistryMeta() {
  return registry.meta;
}
