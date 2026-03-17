import StatCard from "../components/StatCard";
import DashboardCharts from "../components/DashboardCharts";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
