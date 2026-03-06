/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import RiskTable from "./components/RiskTable";
import InfluencerTable from "./components/InfluencerTable";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";



const influencers = [
  {
    id: 1,
    name: "Sunny Bhavsar",
    email: "sunny@gmail.com",
    status: "pending",
    rating: 4,
    platforms: ["Instagram", "YouTube"],
  },
  {
    id: 2,
    name: "Neha Verma",
    email: "neha@gmail.com",
    status: "approved",
    rating: 5,
    platforms: ["Instagram"],
  },
];

const instagramData = [
  { name: "Sunny", followers: 120000 },
  { name: "Neha", followers: 95000 },
  { name: "Rohit", followers: 70000 },
];

const youtubeData = [
  { name: "Priya Shah", views: 240000 },  
  { name: "FitLife", views: 180000 },
  { name: "Foodie", views: 130000 },
];

const statusColor: any = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-orange-100 text-orange-700",
  blacklisted: "bg-black text-white",
};



export default function InfluencersPage() {
  return (
    <div className="p-6 space-y-6">


      <div className="grid grid-cols-4 gap-6">
        <Kpi title="Total Influencers" value="124" />
        <Kpi title="Active" value="92" />
        <Kpi title="Suspended" value="6" />
        <Kpi title="Avg Engagement" value="3.8%" />
      </div>


      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Top Instagram Influencers">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={instagramData}>
              <XAxis dataKey="name" stroke="#86efac" />
              <YAxis stroke="#86efac" />
              <Tooltip />
              <Bar dataKey="followers" fill="#86efac" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top YouTube Reach">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={youtubeData}>
              <XAxis dataKey="name" stroke="#93c5fd" />
              <YAxis stroke="#93c5fd" />
              <Tooltip />
              <Bar dataKey="views" fill="#93c5fd" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <RiskTable />
        <InfluencerTable />
      </div>


      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <h3 className="font-semibold p-4">All Influencers</h3>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Platforms</th>
              <th>Status</th>
              <th>Rating</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {influencers.map((inf) => (
              <tr key={inf.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{inf.name}</td>
                <td>{inf.email}</td>
                <td>{inf.platforms.join(", ")}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusColor[inf.status]}`}
                  >
                    {inf.status}
                  </span>
                </td>
                <td>⭐ {inf.rating}/5</td>
                <td className="text-right pr-4">
                  <Link
                    href={`/admin/influencers/${inf.id}`}
                    className="text-blue-600 text-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function Kpi({ title, value }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
