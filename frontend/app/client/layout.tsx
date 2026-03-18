"use client";

import { UserProvider } from "./components/UserContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <UserProvider>
          <div className="flex h-screen overflow-hidden">

            <div className="w-64 shrink-0">
              <Sidebar />
            </div>

            <div className="flex flex-col flex-1">

              <div className="shrink-0" style={{ backgroundColor: "white" }}>
                <Topbar />
              </div>

              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>

            </div>
          </div>
        </UserProvider>
  );
}
