import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export const metadata = {
  title: "Influencer Platform",
  description: "Manager Panel",
};

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Topbar />

        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
}