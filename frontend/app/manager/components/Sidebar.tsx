"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", path: "/manager/dashboard" },
  { name: "Clients", path: "/manager/clients" },
  { name: "Influencers", path: "/manager/influencers" },
  { name: "Campaigns", path: "/manager/campaigns" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-md">
      <h2 className="text-xl font-bold p-5">
        Manager Panel
      </h2>

      <nav className="p-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-4 py-2 rounded-md ${
              pathname === item.path
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
