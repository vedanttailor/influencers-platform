import StatCard from "../components/StatCard";
import DashboardCharts from "../components/DashboardCharts";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Quick access to clients, influencers, and campaigns.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/manager/clients">
          <StatCard title="Clients" value="120" />
        </Link>

        <Link href="/manager/influencers">
          <StatCard title="Influencers" value="340" />
        </Link>

        <Link href="/manager/campaigns">
          <StatCard title="Campaigns" value="18" />
        </Link>

        <StatCard title="Pending Approvals" value="25" />
      </div>

      {/* Charts */}
      <DashboardCharts />
    </div>
  );
}
