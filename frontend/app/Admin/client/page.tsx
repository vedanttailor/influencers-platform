"use client";
import ClientSpendChart from "./components/ClientSpendChart";
import CampaignStatusChart from "./components/CampaignStatusChart";
import Link from "next/link";

const clients = [
  {
    id: 1,
    name: "Zara India",
    email: "zara@brand.com",
    industry: "Fashion",
    activeCampaigns: 2,
    totalCampaigns: 5,
    totalSpend: 1250000,
    risk: "medium",
  },
  {
    id: 2,
    name: "Nike India",
    email: "nike@brand.com",
    industry: "Sportswear",
    activeCampaigns: 1,
    totalCampaigns: 3,
    totalSpend: 820000,
    risk: "low",
  },
];

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
  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Clients</h1>
        <p className="text-sm text-gray-500">
          Platform-level overview of all clients
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Clients" value="48" />
        <StatCard label="Active Clients" value="32" />
        <StatCard label="High Risk Clients" value="6" />
        <StatCard label="Total Revenue" value="₹78.5L" />
      </div>

      {/* Client Spend Visualization */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="font-semibold mb-4">Top Clients by Spend</h2>

        {clients.map((c) => (
          <div key={c.id} className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{c.name}</span>
              <span>₹{(c.totalSpend / 100000).toFixed(1)}L</span>
            </div>
            <div className="h-2 bg-gray-100 rounded">
              <div
                className="h-2 bg-black rounded"
                style={{ width: `${(c.totalSpend / 1500000) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientSpendChart />
        <CampaignStatusChart />
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clients.map((c) => (
          <div
            key={c.id}
            className="bg-white p-6 rounded-xl shadow border space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{c.name}</h2>
                <p className="text-sm text-gray-500">{c.email}</p>
                <p className="text-xs text-gray-400">{c.industry}</p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full ${riskBadge(
                  c.risk
                )}`}
              >
                {c.risk.toUpperCase()} RISK
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center pt-3">
              <div>
                <p className="text-xs text-gray-500">Active</p>
                <p className="font-semibold">{c.activeCampaigns}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-semibold">{c.totalCampaigns}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Spend</p>
                <p className="font-semibold">
                  ₹{(c.totalSpend / 100000).toFixed(1)}L
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Link
                href={`/admin/client/${c.id}`}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm"
              >
                View Client
              </Link>
            </div>
          </div>
        ))}
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
    <div className="bg-white p-5 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
