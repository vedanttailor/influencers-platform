/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import { api } from "@/lib/api";

function initials(name: string) {
  const safe = String(name || "").trim();
  if (!safe) return "?";
  const parts = safe.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className || "h-4 w-4"}
      aria-hidden="true"
    >
      <path d="M10 6.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM10 11.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM11.25 15a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z" />
    </svg>
  );
}

function ActionMenu({
  onAction,
  disabled,
}: {
  onAction: (action: string) => void;
  disabled?: boolean;
}) {
  return (
    <details className="relative inline-block">
      <summary
        className="list-none inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-60 cursor-pointer"
        aria-disabled={disabled ? "true" : "false"}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <span className="sr-only">Open actions</span>
        <DotsIcon />
      </summary>

      <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
          onClick={(e) => {
            onAction("approve");
            (e.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open");
          }}
        >
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Approve
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
          onClick={(e) => {
            onAction("reject");
            (e.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open");
          }}
        >
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Reject
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
          onClick={(e) => {
            onAction("suspend");
            (e.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open");
          }}
        >
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Suspend
        </button>
        <div className="h-px bg-slate-200/70" />
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
          onClick={(e) => {
            onAction("activate");
            (e.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open");
          }}
        >
          <span className="h-2 w-2 rounded-full bg-slate-900" />
          Activate
        </button>
      </div>
    </details>
  );
}

export default function UsersTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const fetchRows = async () => {
    try {
      const data = await api.get("/admin/users");
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch admin users", e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleAction = async (userId: string, action: string) => {
    try {
      setUpdatingId(userId);
      await api.patch(`/admin/users/${userId}/action`, { action });
      await fetchRows();
    } catch (e) {
      console.error("Failed to apply user action", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((u) => {
      const name = String(u.full_name || "").toLowerCase();
      const email = String(u.email || "").toLowerCase();
      const role = String(u.role || "").toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [rows, query]);

  const displayRows = useMemo(() => filtered.slice(0, 8), [filtered]);

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Users</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {loading ? "Loading..." : `${filtered.length} shown · ${rows.length} total`}
          </p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, role..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
          {displayRows.map((u) => (
              <tr key={u.id} className="border-t border-slate-200/70 hover:bg-slate-50/60 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center text-xs font-bold">
                      {initials(u.full_name || u.email || "")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {u.full_name || "-"}
                      </p>
                      <p className="truncate text-xs text-slate-500">{u.email || "-"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 capitalize text-slate-700">{String(u.role || "-")}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={(u.status || "active") as any} />
                </td>
                <td className="px-5 py-3 text-right">
                  <ActionMenu
                    disabled={updatingId === u.id}
                    onAction={(action) => handleAction(u.id, action)}
                  />
                </td>
              </tr>
          ))}

          {!loading && displayRows.length === 0 && (
            <tr>
              <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                No users found.
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
