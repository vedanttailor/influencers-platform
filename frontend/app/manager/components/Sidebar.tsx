/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  Megaphone,
  User,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
  { name: "Clients", path: "/manager/clients", icon: Users },
  { name: "Influencers", path: "/manager/influencers", icon: UserCheck },
  { name: "Campaigns", path: "/manager/campaigns", icon: Megaphone },
  { name: "Profile", path: "/manager/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white border-r">
      
      <div className="p-6 font-bold text-xl text-black">
        Manager Panel
      </div>

      <nav className="space-y-2 px-4">
        {menu.map((item) => {
          const active = pathname === item.path;

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