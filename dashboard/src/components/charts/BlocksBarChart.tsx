"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { BlockResult } from "@/lib/types";
import { interpret, MAP_ZONES, round1 } from "@/lib/calc";

export function BlocksBarChart({ blocks }: { blocks: BlockResult[] }) {
  const data = blocks.map((b) => ({
    name: `Блок ${b.code}`,
    fullName: b.name,
    score: round1(b.score),
    weight: Math.round(b.weight * 100),
  }));

  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={data} layout="vertical" margin={{ left: 24, right: 32, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="name" width={64} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value) => [`${value} баллов`, "Оценка блока"] as [string, string]}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={22}>
          {data.map((entry, index) => (
            <Cell key={index} fill={interpret(entry.score, MAP_ZONES).color} />
          ))}
          <LabelList dataKey="score" position="right" style={{ fontSize: 12, fontWeight: 600 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
