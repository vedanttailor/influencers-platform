"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

type CampaignRow = {
  id: string;
  campaign_name?: string | null;
  brand_name?: string | null;
  budget?: number | null;
  status?: string | null;
  influencer_id?: string | null;
  manager_id?: string | null;
};

type ClientRow = {
  user_id: string;
  name: string;
  total_spend?: number;
  total_campaigns?: number;
  status?: string;
};

type InfluencerRow = {
  user_id: string;
  name: string;
  followers?: number;
  engagement_rate?: number;
  status?: string;
};

function Badge({ text }: { text: string }) {
  const t = (text || "-").toLowerCase();
  const cls =
    t === "active"
      ? "bg-green-100 text-green-700"
      : t === "rejected"
        ? "bg-red-100 text-red-700"
        : t === "assigned"
          ? "bg-indigo-100 text-indigo-700"
          : t === "applied"
            ? "bg-amber-100 text-amber-700"
            : "bg-slate-100 text-slate-700";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {text || "-"}
    </span>
  );
}

export default function DashboardOverview() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [influencers, setInfluencers] = useState<InfluencerRow[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const [camps, cl, inf, users] = await Promise.all([
          api.get("/admin/campaigns"),
          api.get("/admin/clients"),
          api.get("/admin/influencers"),
          api.get("/admin/users"),
        ]);

        const campsArr = Array.isArray(camps) ? (camps as CampaignRow[]) : [];
        const usersArr = Array.isArray(users) ? users : [];

        setCampaigns(campsArr);
        setClients(Array.isArray(cl) ? (cl as ClientRow[]) : []);
        setInfluencers(Array.isArray(inf) ? (inf as InfluencerRow[]) : []);
        setPendingApprovals(
          usersArr.filter((u: any) => String(u?.status || "").toLowerCase() === "pending").length
        );
      } catch (e) {
        console.error("Failed to fetch admin dashboard overview", e);
        setCampaigns([]);
        setClients([]);
        setInfluencers([]);
        setPendingApprovals(0);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const recentCampaigns = useMemo(() => campaigns.slice(0, 8), [campaigns]);
  const pendingCampaigns = useMemo(
    () =>
      campaigns.filter((c) => ["pending", "applied"].includes(String(c.status || "").toLowerCase()))
        .length,
    [campaigns]
  );

  const topClients = useMemo(() => {
    return [...clients]
      .sort((a, b) => Number(b.total_spend || 0) - Number(a.total_spend || 0))
      .slice(0, 5);
  }, [clients]);

  const topInfluencers = useMemo(() => {
    return [...influencers]
      .sort((a, b) => Number(b.followers || 0) - Number(a.followers || 0))
      .slice(0, 5);
  }, [influencers]);

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Recent campaigns */}
      <div className="bg-white rounded-xl shadow lg:col-span-2">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Recent Campaigns</h3>
            <p className="text-sm text-slate-500">Latest activity across the platform.</p>
          </div>
          <Link
            href="/Admin/campaigns"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-4">Campaign</th>
                <th className="text-left p-4">Brand</th>
                <th className="text-left p-4">Budget</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Assigned</th>
              </tr>
            </thead>
            <tbody>
              {recentCampaigns.map((c) => (
                <tr key={c.id} className="border-t hover:bg-slate-50/60 transition">
                  <td className="p-4 font-medium text-slate-900">{c.campaign_name || "-"}</td>
                  <td className="p-4 text-slate-700">{c.brand_name || "-"}</td>
                  <td className="p-4 text-slate-700">₹{Number(c.budget || 0).toLocaleString()}</td>
                  <td className="p-4">
                    <Badge text={String(c.status || "-")} />
                  </td>
                  <td className="p-4 text-slate-700">{c.influencer_id ? "Yes" : "No"}</td>
                </tr>
              ))}

              {!loading && recentCampaigns.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    No campaigns found.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right column widgets */}
      <div className="space-y-6">
        {/* Pending actions */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-lg font-semibold mb-1">Pending Actions</h3>
          <p className="text-sm text-slate-500 mb-4">Quickly review what needs attention.</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Approvals</p>
                <p className="text-xs text-slate-500">Users waiting for approval</p>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {loading ? "..." : pendingApprovals}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Campaign requests</p>
                <p className="text-xs text-slate-500">Pending / Applied campaigns</p>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {loading ? "..." : pendingCampaigns}
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Link
              href="/Admin/users"
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Review Users
            </Link>
            <Link
              href="/Admin/campaigns"
              className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-slate-800"
            >
              Review Campaigns
            </Link>
          </div>
        </div>

        {/* Top clients */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Top Clients</h3>
            <Link href="/Admin/client" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              View
            </Link>
          </div>

          <div className="space-y-3">
            {(loading ? Array.from({ length: 3 }) : topClients).map((c: any, idx: number) => (
              <div key={c?.user_id || idx} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {loading ? "Loading..." : c.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {loading ? "" : `${c.total_campaigns ?? 0} campaigns`}
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {loading ? "" : `₹${Number(c.total_spend || 0).toLocaleString()}`}
                </p>
              </div>
            ))}

            {!loading && topClients.length === 0 && (
              <p className="text-sm text-slate-500">No client data yet.</p>
            )}
          </div>
        </div>

        {/* Top influencers */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Top Influencers</h3>
            <Link href="/Admin/influencers" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              View
            </Link>
          </div>

          <div className="space-y-3">
            {(loading ? Array.from({ length: 3 }) : topInfluencers).map((inf: any, idx: number) => (
              <div key={inf?.user_id || idx} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {loading ? "Loading..." : inf.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {loading ? "" : `${Number(inf.engagement_rate || 0)}% engagement`}
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {loading ? "" : `${Number(inf.followers || 0).toLocaleString()} followers`}
                </p>
              </div>
            ))}

            {!loading && topInfluencers.length === 0 && (
              <p className="text-sm text-slate-500">No influencer data yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

