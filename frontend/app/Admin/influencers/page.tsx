/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type InfluencerRow = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  status: string;
  category: string | null;
  followers: number;
  engagement_rate: number;
  youtube_subscribers: number;
  youtube_views: number;
  youtube_videos: number;
  platforms: string[];
  active_campaigns: number;
};

type CampaignRow = {
  id: string;
  campaign_name: string;
  brand_name: string;
  client_id: string | null;
  influencer_id: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
};

const statusColor: any = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-orange-100 text-orange-700",
  inactive: "bg-gray-100 text-gray-700",
};

export default function InfluencersPage() {
  const [rows, setRows] = useState<InfluencerRow[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [influencersData, campaignsData, usersData] = await Promise.all([
          api.get("/admin/influencers"),
          api.get("/admin/campaigns"),
          api.get("/admin/users"),
        ]);
        setRows(Array.isArray(influencersData) ? influencersData : []);
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (e) {
        console.error("Failed to fetch admin influencers", e);
        setRows([]);
        setCampaigns([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const total = rows.length;
  const active = useMemo(
    () => rows.filter((r) => r.status === "active").length,
    [rows],
  );
  const suspended = useMemo(
    () => rows.filter((r) => r.status === "suspended").length,
    [rows],
  );
  const avgEngagement = useMemo(() => {
    if (rows.length === 0) return 0;
    return (
      rows.reduce((sum, row) => sum + Number(row.engagement_rate || 0), 0) /
      rows.length
    );
  }, [rows]);

  const topInstagram = useMemo(
    () =>
      [...rows]
        .filter((r) =>
          (r.platforms || []).some((p) => p.toLowerCase().includes("instagram")),
        )
        .sort((a, b) => (b.followers || 0) - (a.followers || 0))
        .slice(0, 5)
        .map((r) => ({
          name: r.name,
          followers: r.followers || 0,
        })),
    [rows],
  );

  const topYouTube = useMemo(
    () =>
      [...rows]
        .filter((r) =>
          (r.platforms || []).some((p) => p.toLowerCase().includes("youtube")),
        )
        .sort(
          (a, b) => (b.youtube_subscribers || 0) - (a.youtube_subscribers || 0),
        )
        .slice(0, 5)
        .map((r) => ({
          name: r.name,
          views: r.youtube_subscribers || 0,
        })),
    [rows],
  );

  const userMap = useMemo(() => {
    const map: Record<string, string> = {};
    users.forEach((u) => {
      map[String(u.id)] = u.full_name || u.email || "Unknown";
    });
    return map;
  }, [users]);

  const workflowRows = useMemo(() => {
    const items = rows.flatMap((influencer) => {
      const assigned = campaigns
        .filter(
          (c) => String(c.influencer_id || "") === String(influencer.user_id),
        )
        .sort(
          (a, b) =>
            new Date(b.start_date || 0).getTime() -
            new Date(a.start_date || 0).getTime(),
        );

      if (assigned.length === 0) {
        return [
          {
            key: `${influencer.id}-none`,
            influencerName: influencer.name,
            campaignName: "-",
            clientName: "-",
            status: "no-task",
            start: "-",
            end: "-",
          },
        ];
      }

      return assigned.slice(0, 3).map((c) => ({
        key: `${influencer.id}-${c.id}`,
        influencerName: influencer.name,
        campaignName: c.campaign_name || "-",
        clientName: userMap[String(c.client_id || "")] || "-",
        status: c.status || "-",
        start: c.start_date ? new Date(c.start_date).toLocaleDateString() : "-",
        end: c.end_date ? new Date(c.end_date).toLocaleDateString() : "-",
      }));
    });

    return items.slice(0, 18);
  }, [rows, campaigns, userMap]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          title="Total Influencers"
          value={loading ? "..." : String(total)}
        />
        <Kpi title="Active" value={loading ? "..." : String(active)} />
        <Kpi title="Suspended" value={loading ? "..." : String(suspended)} />
        <Kpi
          title="Avg Engagement"
          value={loading ? "..." : `${avgEngagement.toFixed(2)}%`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Top Instagram Influencers">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topInstagram}>
              <XAxis dataKey="name" stroke="#86efac" />
              <YAxis stroke="#86efac" />
              <Tooltip />
              <Bar dataKey="followers" fill="#86efac" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top YouTube Reach">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topYouTube}>
              <XAxis dataKey="name" stroke="#93c5fd" />
              <YAxis stroke="#93c5fd" />
              <Tooltip />
              <Bar dataKey="views" fill="#93c5fd" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="card overflow-hidden rounded-xl">
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
            {rows.map((inf) => (
              <tr key={inf.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{inf.name}</td>
                <td>{inf.email}</td>
                <td>{(inf.platforms || []).join(", ") || "-"}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      statusColor[inf.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {inf.status}
                  </span>
                </td>
                <td>{Number(inf.engagement_rate || 0).toFixed(2)}%</td>
                <td className="text-right pr-4">
                  <Link
                    href={`/Admin/influencers/${inf.user_id}`}
                    className="text-blue-600 text-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  No influencers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card overflow-hidden rounded-xl">
        <div className="border-b border-slate-200/80 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Influencer Workflow Records
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Live task records to monitor assigned work and campaign execution.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Influencer</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
              </tr>
            </thead>
            <tbody>
              {workflowRows.map((row) => (
                <tr key={row.key} className="border-t border-slate-200/70">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {row.influencerName}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {row.campaignName}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.clientName}</td>
                  <td className="px-4 py-3 capitalize text-slate-700">
                    {row.status}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.start}</td>
                  <td className="px-4 py-3 text-slate-600">{row.end}</td>
                </tr>
              ))}
              {!loading && workflowRows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No influencer workflow records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Kpi({ title, value }: any) {
  return (
    <div className="card p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
