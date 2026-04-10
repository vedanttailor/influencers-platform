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
      <div className="shell-root">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="shrink-0">
            <Topbar />
          </div>

          <main className="app-main p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}