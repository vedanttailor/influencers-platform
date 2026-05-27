/* eslint-disable @typescript-eslint/no-explicit-any */
 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  Reply,
  User,
  PieChart,
} from "lucide-react";

const items: { href: string; icon: typeof LayoutDashboard; label: string }[] = [
  { href: "/client/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/client/campaigns", icon: Megaphone, label: "Campaigns" },
  // { href: "/client/create-campaign", icon: PlusCircle, label: "Create Campaign" },
  { href: "/client/influencer-response", icon: Reply, label: "Influencer Response" },
  { href: "/client/reports", icon: PieChart, label: "Reports" },
  { href: "/client/profile", icon: User, label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="shell-sidebar flex h-screen w-full flex-col">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="sidebar-label">Workspace</p>
        <p className="sidebar-title">Client</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {items.map(({ href, icon: Icon, label }) => {
          const active =
            pathname === href ||
            (href !== "/client/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`nav-item ${active ? "nav-item-active" : ""}`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" strokeWidth={2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
