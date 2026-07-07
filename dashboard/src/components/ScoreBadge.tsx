import type { InterpretationLevel } from "@/lib/types";
import { round1 } from "@/lib/calc";

export function ScoreBadge({
  score,
  level,
  size = "md",
}: {
  score: number;
  level: InterpretationLevel;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses}`}
      style={{ backgroundColor: level.color, color: level.textColor }}
    >
      {round1(score)}
      <span className="opacity-90 font-medium">{level.label}</span>
    </span>
  );
}

export function ScoreDot({ level }: { level: InterpretationLevel }) {
  return <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: level.color }} />;
}
