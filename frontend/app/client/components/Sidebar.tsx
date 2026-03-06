"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  User,
  MessageSquare,
} from "lucide-react";

const menu = [
  { name: "Campaigns", icon: LayoutDashboard, href: "/client/campaigns" },
  { name: "Create Campaign", icon: PlusCircle, href: "/client/create-campaign" },
  { name: "Influencer Response", icon: MessageSquare, href: "/client/influencer-response" },
  { name: "Reports", icon: BarChart3, href: "/client/reports" },
  { name: "Profile", icon: User, href: "/client/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800">

      <div className="p-6 text-xl font-semibold">
        Influencer CRM
      </div>

      <nav className="space-y-1 px-3">

        {menu.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm
              ${active
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}

      </nav>
    </aside>
  );
}