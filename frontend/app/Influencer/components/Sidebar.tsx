"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  IndianRupee,
  User,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col">
      
      <div className="p-6 font-bold text-xl text-black">
        Welcome Influencer
      </div>

      <nav className="space-y-2 px-4">
        <SidebarItem
          href="/Influencer/dashboard"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          active={pathname === "/Influencer/dashboard"}
        />

        <SidebarItem
          href="/Influencer/campaigns"
          icon={<Megaphone size={18} />}
          label="Campaigns"
          active={pathname === "/Influencer/campaigns"}
        />

        <SidebarItem
          href="/Influencer/earnings"
          icon={<IndianRupee size={18} />}
          label="Earnings"
          active={pathname === "/Influencer/earnings"}
        />

        <SidebarItem
          href="/Influencer/profile"
          icon={<User size={18} />}
          label="Profile"
          active={pathname === "/Influencer/profile"}
        />
      </nav>
    </aside>
  );
}

function SidebarItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg text-sm transition ${
        active
          ? "bg-blue-100 text-blue-600 font-medium"
          : "text-gray-700 hover:bg-blue-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}