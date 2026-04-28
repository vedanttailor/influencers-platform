/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ReportsPage() {
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [campaignPerformance, setCampaignPerformance] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // ✅ FIXED API PATH
      const data = await api.get("/campaigns/reports");

      // ✅ FIX SUMMARY (convert object → array)
      setSummaryData([
        { title: "Total Campaigns", value: data.summary?.total || 0 },
        { title: "Active Campaigns", value: data.summary?.active || 0 },
        { title: "Completed Campaigns", value: data.summary?.completed || 0 },
        { title: "Total Spend", value: `₹${data.summary?.spend || 0}` },
      ]);

      // ✅ FIX PERFORMANCE
      setCampaignPerformance(Array.isArray(data.performance) ? data.performance : []);

      // ✅ FIX BUDGET (convert object → array)
      setBudgetData([
        { name: "Spent", value: data.budget?.spent || 0 },
        { name: "Remaining", value: data.budget?.remaining || 0 },
      ]);

    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  };

  // ⚠️ OPTIONAL: remove or keep (backend not implemented yet)
  const handleDownload = () => {
    toast("Download API not implemented yet");
  };

  if (loading) {
    return <p className="text-center mt-10">Loading reports...</p>;
  }

  const COLORS = ["#2563eb", "#93c5fd"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Download Report
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {summaryData.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">{item.title}</p>
            <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Campaign Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignPerformance}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="engagement" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Budget Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {budgetData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Campaign</th>
              <th className="p-4">Status</th>
              <th className="p-4">Engagement</th>
              <th className="p-4">Spend</th>
            </tr>
          </thead>
          <tbody>
            {campaignPerformance.map((c, i) => (
              <tr key={i} className="border-t">
                <td className="p-4">{c.name}</td>
                <td className="p-4">{c.status || "-"}</td>
                <td className="p-4">{c.engagement}</td>
                <td className="p-4">₹{c.spend || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}