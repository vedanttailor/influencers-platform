"use client";

import Sidebar from "./Sidebar";
import Topbar from "./TopBar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      
      <aside className="w-64 shrink-0">
        <Sidebar />
      </aside>

      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
