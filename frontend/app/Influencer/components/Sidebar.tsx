"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  DollarSign,
  User
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/Influencer/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Campaigns",
    href: "/Influencer/campaigns",
    icon: Megaphone,
  },
  {
    name: "Earnings",
    href: "/Influencer/earnings",
    icon: DollarSign,
  },
  {
    name: "Profile",
    href: "/Influencer/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 flex flex-col"
      style={{ backgroundColor: "white", color: "black" }}
    >

      {/* Logo */}
      <div
        className="px-6 py-5 text-xl font-bold border-b"
        style={{ borderColor: "#e5e7eb", color: "black" }}
      >
        Influencer CRM
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition"
              style={{
                color: active ? "black" : "#374151",
                backgroundColor: active ? "#e5e7eb" : "transparent"
              }}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}