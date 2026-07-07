export type IndicatorDirection = "positive" | "negative";

export interface RawIndicatorRecord {
  id: number;
  unodc_component: string;
  unodc_aspect: string;
  indicator_code: string;
  indicator_name: string;
  measurement_method: string;
  category: string;
  subcategory: string;
  source_type: string;
  calculation_method: string;
  disaggregation: string;
  available_in_kg: boolean;
  data_source_institution: string;
  responsible_institution: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  discrepancy_comment: string;
  time_series_available: string;
  block_code: string;
  block_weight: number;
  block_name: string;
}

export interface IndicatorConfig {
  direction: IndicatorDirection;
  unit: string;
  xMin: number;
  xMax: number;
}

export interface Indicator extends RawIndicatorRecord, IndicatorConfig {
  /** Вес индикатора внутри блока (Wij), сумма по блоку = 1 */
  weightInBlock: number;
}

export interface Block {
  code: string;
  name: string;
  /** Вес блока в интегральном индексе (Wi), сумма = 1 */
  weight: number;
  indicators: Indicator[];
}

export type EntityType = "country" | "region" | "city" | "agency";

export interface EntityRecord {
  code: string;
  name: string;
  type: EntityType;
  parentCode?: string;
  lat?: number;
  lon?: number;
  shapeISO?: string;
}

export interface Period {
  code: string;
  year: number;
  label: string;
}

export interface IndicatorResult {
  indicator: Indicator;
  rawValue: number;
  normalizedScore: number;
}

export interface BlockResult {
  code: string;
  name: string;
  weight: number;
  score: number;
  indicators: IndicatorResult[];
}

export interface InterpretationLevel {
  label: string;
  min: number;
  max: number;
  color: string;
  textColor: string;
}

export interface EntityPeriodResult {
  entity: EntityRecord;
  period: Period;
  indexScore: number;
  level: InterpretationLevel;
  zone: InterpretationLevel;
  blocks: BlockResult[];
}

export interface Alert {
  id: string;
  severity: "high" | "medium" | "low";
  entityCode: string;
  entityName: string;
  periodCode: string;
  indicatorCode: string;
  indicatorName: string;
  blockName: string;
  message: string;
  score: number;
}
