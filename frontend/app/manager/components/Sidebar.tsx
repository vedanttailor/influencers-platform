/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  Megaphone,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
  { name: "Clients", path: "/manager/clients", icon: Users },
  { name: "Influencers", path: "/manager/influencers", icon: UserCheck },
  { name: "Campaigns", path: "/manager/campaigns", icon: Megaphone },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="shell-sidebar flex flex-col">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="sidebar-label">Workspace</p>
        <p className="sidebar-title">Manager</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {menu.map((item) => {
          const active =
            pathname === item.path ||
            (item.path !== "/manager/dashboard" &&
              pathname.startsWith(item.path));

          return (
            <SidebarItem
              key={item.path}
              href={item.path}
              icon={<item.icon size={20} />}
              label={item.name}
              active={active}
            />
          );
        })}
      </nav>
    </aside>
  );
}


function SidebarItem({ href, icon, label, active }: any) {
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