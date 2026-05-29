"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  IndianRupee,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="shell-sidebar flex flex-col">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="sidebar-label">Workspace</p>
        <p className="sidebar-title">Influencer</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
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
      className={`nav-item ${active ? "nav-item-active" : ""}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}