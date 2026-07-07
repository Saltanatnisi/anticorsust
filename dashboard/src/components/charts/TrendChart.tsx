"use client";

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function TrendChart({ data }: { data: { period: string; score: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ left: 8, right: 24, top: 16, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="period" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <ReferenceLine y={60} stroke="#eab308" strokeDasharray="4 4" />
        <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="4 4" />
        <Tooltip formatter={(value) => [`${value} баллов`, "ИАУ"] as [string, string]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Line type="monotone" dataKey="score" stroke="#047857" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
