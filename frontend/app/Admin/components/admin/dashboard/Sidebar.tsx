"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiUser,
  FiActivity,
} from "react-icons/fi";

const menu = [
  { name: "Dashboard", path: "/Admin/dashboard", icon: FiHome },
  { name: "Clients", path: "/Admin/client", icon: FiUsers },
  { name: "Influencers", path: "/Admin/influencers", icon: FiActivity },
  { name: "Manager", path: "/Admin/manager", icon: FiBriefcase },
  { name: "Profile", path: "/Admin/profile", icon: FiUser },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow h-screen p-5">
      <h2 className="text-xl font-bold font-serif mb-6">Admin</h2>

      <nav className="space-y-2">
        {menu.map((item) => {
          const active = pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 rounded px-3 py-2 transition
                ${
                  active
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <item.icon className="text-lg" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
