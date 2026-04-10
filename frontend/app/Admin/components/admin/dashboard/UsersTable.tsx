/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import { api } from "@/lib/api";

function ActionMenu({
  onAction,
  disabled,
}: {
  onAction: (action: string) => void;
  disabled?: boolean;
}) {
  return (
    <select
      disabled={disabled}
      defaultValue=""
      onChange={(e) => {
        const value = e.target.value;
        if (!value) return;
        onAction(value);
        e.target.value = "";
      }}
      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 disabled:opacity-60"
    >
      <option value="">Action</option>
      <option value="approve">Approve</option>
      <option value="reject">Reject</option>
      <option value="suspend">Suspend</option>
      <option value="activate">Activate</option>
    </select>
  );
}

export default function UsersTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const displayRows = useMemo(() => rows.slice(0, 6), [rows]);

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">Users</h3>
        <span className="text-xs text-slate-500">
          {loading ? "Loading..." : `${rows.length} total`}
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayRows.map((u) => (
            <tr key={u.id} className="border-t border-slate-200/70">
              <td className="py-2 font-medium text-slate-900">
                {u.full_name || "-"}
              </td>
              <td className="capitalize">{String(u.role || "-")}</td>
              <td>
                <StatusBadge status={(u.status || "active") as any} />
              </td>
              <td className="text-right">
                <ActionMenu
                  disabled={updatingId === u.id}
                  onAction={(action) => handleAction(u.id, action)}
                />
              </td>
            </tr>
          ))}

          {!loading && displayRows.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-slate-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
