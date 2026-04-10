"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type ClientRow = {
  id: string;
  user_id: string;
  name: string;
  company_name: string | null;
  email: string;
  status: string;
  active_campaigns: number;
  total_campaigns: number;
  total_spend: number;
};

type CampaignRow = {
  id: string;
  campaign_name: string;
  brand_name: string;
  campaign_type: string;
  campaign_category: string;
  client_id: string | null;
  influencer_id: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
};

const riskBadge = (risk: string) => {
  switch (risk) {
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-green-100 text-green-700";
  }
};

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [clientsData, campaignsData] = await Promise.all([
          api.get("/admin/clients"),
          api.get("/admin/campaigns"),
        ]);
        setClients(Array.isArray(clientsData) ? clientsData : []);
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
      } catch (e) {
        console.error("Failed to fetch admin clients", e);
        setClients([]);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const totalClients = clients.length;
  const activeClients = useMemo(
    () => clients.filter((c) => c.status === "active").length,
    [clients],
  );
  const totalRevenue = useMemo(
    () => clients.reduce((sum, c) => sum + Number(c.total_spend || 0), 0),
    [clients],
  );
  const highRiskClients = useMemo(
    () => clients.filter((c) => (c.active_campaigns || 0) === 0).length,
    [clients],
  );

  const topBySpend = useMemo(
    () => [...clients].sort((a, b) => b.total_spend - a.total_spend).slice(0, 5),
    [clients],
  );

  const maxSpend = useMemo(
    () => Math.max(...topBySpend.map((c) => c.total_spend), 1),
    [topBySpend],
  );

  const workflowRows = useMemo(() => {
    const items = clients.flatMap((client) => {
      const clientCampaigns = campaigns
        .filter((c) => String(c.client_id || "") === String(client.user_id))
        .sort(
          (a, b) =>
            new Date(b.start_date || 0).getTime() - new Date(a.start_date || 0).getTime(),
        );

      if (clientCampaigns.length === 0) {
        return [
          {
            key: `${client.id}-none`,
            clientName: client.name,
            campaignName: "-",
            brand: "-",
            status: "no-task",
            start: "-",
            end: "-",
            budget: "-",
          },
        ];
      }

      return clientCampaigns.slice(0, 3).map((c) => ({
        key: `${client.id}-${c.id}`,
        clientName: client.name,
        campaignName: c.campaign_name || "-",
        brand: c.brand_name || "-",
        status: c.status || "-",
        start: c.start_date ? new Date(c.start_date).toLocaleDateString() : "-",
        end: c.end_date ? new Date(c.end_date).toLocaleDateString() : "-",
        budget: typeof c.budget === "number" ? `₹${(c.budget / 100000).toFixed(1)}L` : "-",
      }));
    });

    return items.slice(0, 18);
  }, [clients, campaigns]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Clients</h1>
        <p className="text-sm text-slate-500">
          Platform-level overview of all clients
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Total Clients" value={loading ? "..." : String(totalClients)} />
        <StatCard label="Active Clients" value={loading ? "..." : String(activeClients)} />
        <StatCard
          label="High Risk Clients"
          value={loading ? "..." : String(highRiskClients)}
        />
        <StatCard
          label="Total Revenue"
          value={loading ? "..." : `₹${(totalRevenue / 100000).toFixed(1)}L`}
        />
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-4">Top Clients by Spend</h2>

        {topBySpend.map((c) => (
          <div key={c.id} className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{c.name}</span>
              <span>₹{(c.total_spend / 100000).toFixed(1)}L</span>
            </div>
            <div className="h-2 rounded bg-gray-100">
              <div
                className="h-2 rounded bg-black"
                style={{ width: `${(c.total_spend / maxSpend) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {!loading && topBySpend.length === 0 && (
          <p className="text-sm text-slate-500">No client data available.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {clients.map((c) => (
          <div key={c.id} className="card space-y-3 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{c.name}</h2>
                <p className="text-sm text-gray-500">{c.email}</p>
                <p className="text-xs text-gray-400">{c.company_name || "-"}</p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full ${riskBadge(
                  c.active_campaigns === 0 ? "high" : c.active_campaigns <= 1 ? "medium" : "low"
                )}`}
              >
                {(c.active_campaigns === 0
                  ? "high"
                  : c.active_campaigns <= 1
                    ? "medium"
                    : "low"
                ).toUpperCase()}{" "}
                RISK
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center pt-3">
              <div>
                <p className="text-xs text-gray-500">Active</p>
                <p className="font-semibold">{c.active_campaigns}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-semibold">{c.total_campaigns}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Spend</p>
                <p className="font-semibold">
                  ₹{(c.total_spend / 100000).toFixed(1)}L
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Link
                href={`/Admin/client/${c.id}`}
                className="rounded-lg bg-black px-4 py-2 text-sm text-white"
              >
                View Client
              </Link>
            </div>
          </div>
        ))}
        {!loading && clients.length === 0 && (
          <p className="text-sm text-slate-500">No clients found.</p>
        )}
      </div>

      <div className="card overflow-hidden rounded-xl">
        <div className="border-b border-slate-200/80 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Client Workflow Records</h3>
          <p className="mt-1 text-xs text-slate-500">
            Live campaign tasks grouped by client so admin can track project flow.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3 text-right">Budget</th>
              </tr>
            </thead>
            <tbody>
              {workflowRows.map((row) => (
                <tr key={row.key} className="border-t border-slate-200/70">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.clientName}</td>
                  <td className="px-4 py-3 text-slate-700">{row.campaignName}</td>
                  <td className="px-4 py-3 text-slate-700">{row.brand}</td>
                  <td className="px-4 py-3 capitalize text-slate-700">{row.status}</td>
                  <td className="px-4 py-3 text-slate-600">{row.start}</td>
                  <td className="px-4 py-3 text-slate-600">{row.end}</td>
                  <td className="px-4 py-3 text-right text-slate-800">{row.budget}</td>
                </tr>
              ))}
              {!loading && workflowRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    No client workflow records found.
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

/* Small reusable stat card */
function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="card p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
