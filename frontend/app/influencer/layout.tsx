import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shell-root">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="app-main p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}