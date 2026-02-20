"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Campaigns", href: "/campaigns" },
  { name: "Earnings", href: "/earnings" },
  { name: "Profile", href: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow border-r">
      <div className="p-6 font-bold text-xl">
        Influencer
      </div>

      <nav className="space-y-1 px-4">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`block px-4 py-2 rounded-lg text-sm
              ${
                pathname === link.href
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
