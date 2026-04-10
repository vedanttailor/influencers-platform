"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "./components/admin/dashboard/Sidebar";
import Topbar from "./components/admin/dashboard/TopBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowed={["admin"]}>
      <div className="shell-root">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="app-main p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
