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
      <div className="flex min-h-screen bg-slate-50">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden pl-20">
          <Topbar />

          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {children}
          </main>
        </div>

      </div>
    </ProtectedRoute>
  );
}