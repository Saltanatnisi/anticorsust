import { geoMercator, geoPath } from "d3-geo";
import geojsonRaw from "@/data/kgz-regions.geo.json";

/**
 * Серверный модуль: строит SVG-пути регионов Кыргызстана из GeoJSON (только
 * 7 областей — источник geoBoundaries не выделяет города Бишкек/Ош отдельными
 * полигонами). Бишкек и Ош показываются на карте точечными маркерами.
 *
 * Модуль импортируется только из серверных компонентов, поэтому «сырой»
 * GeoJSON (~165 КБ) не попадает в клиентский бандл — на клиент передаются
 * только вычисленные строки path.
 */

export const MAP_WIDTH = 760;
export const MAP_HEIGHT = 420;

interface GeoFeature {
  type: "Feature";
  properties: { shapeName: string; shapeISO: string };
  geometry: GeoJSON.Geometry;
}

interface GeoFeatureCollection {
  type: "FeatureCollection";
  features: GeoFeature[];
}

const geojson = geojsonRaw as unknown as GeoFeatureCollection;

function buildProjection() {
  return geoMercator().fitSize(
    [MAP_WIDTH, MAP_HEIGHT],
    geojson as unknown as Parameters<ReturnType<typeof geoMercator>["fitSize"]>[1],
  );
}

export interface RegionPath {
  shapeISO: string;
  shapeName: string;
  path: string;
}

export function getRegionPaths(): RegionPath[] {
  const projection = buildProjection();
  const pathGen = geoPath(projection);
  return geojson.features.map((feature) => ({
    shapeISO: feature.properties.shapeISO,
    shapeName: feature.properties.shapeName,
    path: pathGen(feature as never) ?? "",
  }));
}

export function projectPoint(lon: number, lat: number): [number, number] | null {
  const projection = buildProjection();
  return projection([lon, lat]);
}
