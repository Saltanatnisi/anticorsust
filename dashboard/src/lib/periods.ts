import type { Period } from "./types";

export const PERIODS: Period[] = [
  { code: "2023", year: 2023, label: "2023 год" },
  { code: "2024", year: 2024, label: "2024 год" },
  { code: "2025", year: 2025, label: "2025 год" },
];

export const LATEST_PERIOD = PERIODS[PERIODS.length - 1];

export function getPeriodByCode(code: string): Period | undefined {
  return PERIODS.find((p) => p.code === code);
}
