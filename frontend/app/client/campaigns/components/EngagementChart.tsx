/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { api } from "@/lib/api";

const COLORS = ["#2563eb", "#60a5fa", "#93c5fd"];

export default function EngagementPieChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/campaigns");

        const total = res.length;

        setData([
          { name: "Active", value: res.filter((c: any) => c.status === "active").length },
          { name: "Completed", value: res.filter((c: any) => c.status === "completed").length },
          { name: "Total", value: total },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetch();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-4">
        Campaign Engagement
      </h3>

      <PieChart width={350} height={250}>
        <Pie data={data} dataKey="value" label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}