"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Priya Shah", views: 240000 },
  { name: "FitLife", views: 180000 },
  { name: "Foodie", views: 130000 },
];

export default function YoutubeChart() {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Top YouTube Reach</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#93c5fd" />
          <YAxis stroke="#93c5fd" />
          <Tooltip />
          <Bar dataKey="views" fill="#93c5fd" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
