"use client";

import { UserProvider } from "./campaigns/components/UserContext";
import Sidebar from "./campaigns/components/Sidebar";
import Topbar from "./campaigns/components/Topbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="flex min-h-screen bg-slate-50">

        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden pl-20">
          <Topbar />

          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {children}
          </main>
        </div>

      </div>
    </UserProvider>
  );
}