"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  IndianRupee,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    path: "/Influencer/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Campaigns",
    path: "/Influencer/campaigns",
    icon: Megaphone,
  },
  {
    name: "Earnings",
    path: "/Influencer/earnings",
    icon: IndianRupee,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        group
        fixed
        left-0
        top-0
        z-50
        flex
        h-screen
        w-20
        hover:w-64
        flex-col
        overflow-hidden
        bg-[#06153A]
        transition-all
        duration-300
        shadow-xl
      "
    >
      {/* HEADER */}
      <div className="border-b border-white/10 h-20 flex items-center justify-center px-4">

        <LayoutDashboard
          size={24}
          className="text-cyan-400 shrink-0"
        />

        <div
          className="
            ml-3
            whitespace-nowrap
            opacity-0
            invisible
            group-hover:visible
            group-hover:opacity-100
            transition-all
            duration-300
          "
        >
          <p className="text-[10px] uppercase tracking-[3px] text-slate-400">
            Workspace
          </p>

          <p className="text-xl font-semibold text-white">
            Influencer
          </p>
        </div>

      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-5 space-y-3">

        {menu.map((item) => {

          const active = pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`
                flex
                items-center
                h-12
                rounded-xl
                px-3
                transition-all
                duration-300
                ${
                  active
                    ? "bg-cyan-900/40 text-cyan-400"
                    : "text-slate-300 hover:bg-slate-800"
                }
              `}
            >
              <span
                className="
                  flex
                  w-8
                  justify-center
                  shrink-0
                "
              >
                <item.icon
                  size={20}
                  strokeWidth={2}
                />
              </span>

              <span
                className="
                  ml-4
                  whitespace-nowrap
                  opacity-0
                  invisible
                  group-hover:visible
                  group-hover:opacity-100
                  transition-all
                  duration-300
                "
              >
                {item.name}
              </span>

            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-white/10 p-4">

        <div className="flex items-center justify-center group-hover:justify-start transition-all duration-300">

          <div
            className="
              h-10
              w-10
              rounded-full
              bg-slate-900
              text-white
              flex
              items-center
              justify-center
              font-semibold
              shrink-0
            "
          >
            I
          </div>

          <span
            className="
              ml-3
              text-sm
              text-white
              whitespace-nowrap
              opacity-0
              invisible
              group-hover:visible
              group-hover:opacity-100
              transition-all
              duration-300
            "
          >
            Influencer
          </span>

        </div>

      </div>
    </aside>
  );
}