"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CartesianGrid } from "recharts";



const data = [
  { name: "Zara India", spend: 1250000 },
  { name: "Nike India", spend: 820000 },
  { name: "Puma India", spend: 640000 },
  { name: "H&M India", spend: 430000 },
];

export default function ClientSpendChart() {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="font-semibold mb-4">Client Spend Overview</h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

            <XAxis
                dataKey="name"
                stroke="#93c5fd"
                tick={{ fill: "#93c5fd" }}
            />

            <YAxis
                stroke="#93c5fd"
                tick={{ fill: "#93c5fd" }}
            />

            <Tooltip
                contentStyle={{ backgroundColor: "#ecfdf5", borderColor: "#86efac" }}
            />

            <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
            </defs>

            <Bar
                dataKey="spend"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
            />
            </BarChart>


        </ResponsiveContainer>
      </div>
    </div>
  );
}
