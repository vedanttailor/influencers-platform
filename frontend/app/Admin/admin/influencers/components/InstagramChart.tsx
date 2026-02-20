"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "John", followers: 120000 },
  { name: "Priya", followers: 98000 },
  { name: "Aman", followers: 74000 },
  { name: "Sara", followers: 65000 },
];

export default function InstagramChart() {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Top Instagram Influencers</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#86efac" />
          <YAxis stroke="#86efac" />
          <Tooltip />
          <Bar dataKey="followers" fill="#86efac" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
