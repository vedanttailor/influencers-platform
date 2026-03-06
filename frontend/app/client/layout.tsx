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
      <div className="flex h-screen bg-slate-950 text-white">

        
        <Sidebar />

        
        <div className="flex flex-col flex-1">

         
          <Topbar />

          
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>

        </div>
      </div>
    </UserProvider>
  );
}