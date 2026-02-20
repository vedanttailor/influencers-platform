"use client";

import StatCard from "../../components/admin/dashboard/StatCard";
import UsersTable from "../../components/admin/dashboard/UsersTable";
import CampaignTable from "../../components/admin/dashboard/CampaignTable";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowed={["admin"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Users" value="120" />
          <StatCard title="Influencers" value="45" />
          <StatCard title="Managers" value="10" />
          <StatCard title="Clients" value="65" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <UsersTable />
          <CampaignTable />
        </div>
      </div>
    </ProtectedRoute>
  );
}
