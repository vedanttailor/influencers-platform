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
    href: "/influencer/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Campaigns",
    href: "/influencer/campaigns",
    icon: Megaphone,
  },
  {
    name: "Earnings",
    href: "/influencer/earnings",
    icon: DollarSign,
  },
  {
    name: "Profile",
    href: "/influencer/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="px-6 py-5 text-xl font-bold border-b border-slate-800">
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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
              ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
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