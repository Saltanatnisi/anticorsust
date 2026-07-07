"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MAP_WIDTH, MAP_HEIGHT } from "@/lib/geo";
import { round1 } from "@/lib/calc";

export interface MapRegionDatum {
  code: string;
  name: string;
  path: string;
  score: number;
  color: string;
}

export interface MapCityDatum {
  code: string;
  name: string;
  x: number;
  y: number;
  score: number;
  color: string;
}

export function RegionsMapClient({
  regions,
  cities,
  periodQuery,
}: {
  regions: MapRegionDatum[];
  cities: MapCityDatum[];
  periodQuery: string;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState<{ name: string; score: number; x: number; y: number } | null>(null);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="Карта регионов Кыргызстана — статус антикоррупционной устойчивости"
      >
        {regions.map((r) => (
          <path
            key={r.code}
            d={r.path}
            fill={r.color}
            stroke="#ffffff"
            strokeWidth={1.5}
            className="cursor-pointer transition-opacity hover:opacity-80"
            onClick={() => router.push(`/regions/${r.code}${periodQuery}`)}
            onMouseMove={(e) => {
              const rect = (e.target as SVGElement).ownerSVGElement?.getBoundingClientRect();
              setHovered({
                name: r.name,
                score: r.score,
                x: rect ? e.clientX - rect.left : 0,
                y: rect ? e.clientY - rect.top : 0,
              });
            }}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        {cities.map((c) => (
          <g
            key={c.code}
            className="cursor-pointer"
            onClick={() => router.push(`/regions/${c.code}${periodQuery}`)}
            onMouseMove={(e) => {
              const rect = (e.target as SVGElement).ownerSVGElement?.getBoundingClientRect();
              setHovered({
                name: c.name,
                score: c.score,
                x: rect ? e.clientX - rect.left : 0,
                y: rect ? e.clientY - rect.top : 0,
              });
            }}
            onMouseLeave={() => setHovered(null)}
          >
            <circle cx={c.x} cy={c.y} r={7} fill={c.color} stroke="#0f172a" strokeWidth={1.5} />
            <text x={c.x + 10} y={c.y + 4} fontSize={11} fill="#0f172a" fontWeight={600}>
              {c.name}
            </text>
          </g>
        ))}
      </svg>
      {hovered && (
        <div
          className="pointer-events-none absolute z-10 rounded-md bg-slate-900 text-white text-xs px-2.5 py-1.5 shadow-lg"
          style={{ left: hovered.x + 12, top: hovered.y + 12 }}
        >
          <div className="font-semibold">{hovered.name}</div>
          <div>{round1(hovered.score)} баллов</div>
        </div>
      )}
    </div>
  );
}
