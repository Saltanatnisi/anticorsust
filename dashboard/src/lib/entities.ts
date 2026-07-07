import type { EntityRecord } from "./types";

export const COUNTRY: EntityRecord = {
  code: "KG",
  name: "Кыргызская Республика",
  type: "country",
};

export const REGIONS: EntityRecord[] = [
  { code: "KG-B", name: "Баткенская область", type: "region", parentCode: "KG", shapeISO: "KG-B", lat: 40.06, lon: 70.82 },
  { code: "KG-J", name: "Джалал-Абадская область", type: "region", parentCode: "KG", shapeISO: "KG-J", lat: 41.2, lon: 72.98 },
  { code: "KG-Y", name: "Иссык-Кульская область", type: "region", parentCode: "KG", shapeISO: "KG-Y", lat: 42.2, lon: 77.8 },
  { code: "KG-N", name: "Нарынская область", type: "region", parentCode: "KG", shapeISO: "KG-N", lat: 41.3, lon: 75.4 },
  { code: "KG-O", name: "Ошская область", type: "region", parentCode: "KG", shapeISO: "KG-O", lat: 40.1, lon: 73.3 },
  { code: "KG-T", name: "Таласская область", type: "region", parentCode: "KG", shapeISO: "KG-T", lat: 42.55, lon: 72.1 },
  { code: "KG-C", name: "Чуйская область", type: "region", parentCode: "KG", shapeISO: "KG-C", lat: 42.75, lon: 74.7 },
];

export const CITIES: EntityRecord[] = [
  { code: "KG-GB", name: "г. Бишкек", type: "city", parentCode: "KG", lat: 42.8746, lon: 74.5698 },
  { code: "KG-GO", name: "г. Ош", type: "city", parentCode: "KG", lat: 40.5283, lon: 72.7985 },
];

export const AGENCIES: EntityRecord[] = [
  { code: "AG-GENPROK", name: "Генеральная прокуратура КР", type: "agency", parentCode: "KG" },
  { code: "AG-GKNB", name: "Государственный комитет национальной безопасности КР", type: "agency", parentCode: "KG" },
  { code: "AG-MVD", name: "Министерство внутренних дел КР", type: "agency", parentCode: "KG" },
  { code: "AG-MINFIN", name: "Министерство финансов КР", type: "agency", parentCode: "KG" },
  { code: "AG-MINYUST", name: "Министерство юстиции КР", type: "agency", parentCode: "KG" },
  { code: "AG-SCHETPAL", name: "Счётная палата КР", type: "agency", parentCode: "KG" },
  { code: "AG-GNS", name: "Государственная налоговая служба при КМ КР", type: "agency", parentCode: "KG" },
  { code: "AG-GTS", name: "Государственная таможенная служба при КМ КР", type: "agency", parentCode: "KG" },
  { code: "AG-NATSTAT", name: "Национальный статистический комитет КР", type: "agency", parentCode: "KG" },
  { code: "AG-SUDDEP", name: "Судебный департамент при Верховном суде КР", type: "agency", parentCode: "KG" },
];

export function getAllEntities(): EntityRecord[] {
  return [COUNTRY, ...REGIONS, ...CITIES, ...AGENCIES];
}

export function getEntityByCode(code: string): EntityRecord | undefined {
  return getAllEntities().find((e) => e.code === code);
}

export function getRegionsAndCities(): EntityRecord[] {
  return [...REGIONS, ...CITIES];
}
