// import "./globals.css";
import Sidebar from "../manager/components/Sidebar";
import Topbar from "../manager/components/Topbar";

export const metadata = {
  title: "Influencer CRM",
  description: "Manager Panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">
            <Topbar />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
