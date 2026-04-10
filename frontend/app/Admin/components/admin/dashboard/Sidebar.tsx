/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Activity,
  Briefcase,
  User,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/Admin/dashboard", icon: LayoutDashboard },
  { name: "Clients", path: "/Admin/client", icon: Users },
  { name: "Influencers", path: "/Admin/influencers", icon: Activity },
  { name: "Manager", path: "/Admin/manager", icon: Briefcase },
  { name: "Profile", path: "/Admin/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="shell-sidebar flex h-screen w-64 shrink-0 flex-col">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="sidebar-label">Console</p>
        <p className="sidebar-title">Admin</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {menu.map((item) => {
          const active = pathname.startsWith(item.path);

          return (
            <SidebarItem
              key={item.name}
              href={item.path}
              icon={<item.icon size={18} strokeWidth={2} />}
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
      <span className="shrink-0 opacity-90">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
