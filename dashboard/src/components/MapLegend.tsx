import { MAP_ZONES } from "@/lib/calc";

export function MapLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-slate-600">
      {MAP_ZONES.map((zone) => (
        <div key={zone.label} className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: zone.color }} />
          <span>
            {zone.max >= 100 ? `${zone.min}+` : `${zone.min}–${Math.floor(zone.max)}`} · {zone.label.split(" — ")[1] ?? zone.label}
          </span>
        </div>
      ))}
    </div>
  );
}
