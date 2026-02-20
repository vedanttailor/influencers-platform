"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { campaign: "Diwali Blast", views: 120000 },
  { campaign: "Summer Sale", views: 98000 },
];

export default function CampaignPerformanceTab() {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Campaign Performance</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="campaign" stroke="#86efac" />
          <YAxis stroke="#86efac" />
          <Tooltip />
          <Bar dataKey="views" fill="#86efac" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
