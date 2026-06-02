import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export const metadata = {
  title: "Influencer Platform",
  description: "Influencer Panel",
};

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pl-20">

        <Topbar />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}