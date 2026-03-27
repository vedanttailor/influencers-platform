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
    <aside className="w-64 h-screen bg-white border-r">
      
      <div className="p-6 font-bold text-xl text-black">
        Welcome Admin
      </div>

      <nav className="space-y-2 px-4">
        {menu.map((item) => {
          const active = pathname.startsWith(item.path);

          return (
            <SidebarItem
              key={item.name}
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
      className={`flex items-center gap-3 p-3 rounded transition
        ${
          active
            ? "bg-blue-100 text-blue-600 font-medium"
            : "text-black hover:bg-blue-50"
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}