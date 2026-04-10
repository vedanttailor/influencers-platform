/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import StatusBadge from "../admin/dashboard/StatusBadge";
import { api } from "@/lib/api";

export default function ManagerTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await api.get("/admin/managers");
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch managers", e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const displayRows = useMemo(() => rows, [rows]);

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">All managers</h3>
        <span className="text-xs text-slate-500">
          {loading ? "Loading..." : `${rows.length} total`}
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Approval</th>
          </tr>
        </thead>
        <tbody>
          {displayRows.map((m) => (
            <tr key={m.id} className="border-t border-slate-200/70">
              <td className="py-2 font-medium text-slate-900">
                {m.full_name || "-"}
              </td>
              <td className="text-slate-700">{m.email || "-"}</td>
              <td>
                <StatusBadge status={(m.status || "active") as any} />
              </td>
              <td className="capitalize text-slate-700">
                {String(m.approval_status || "-")}
              </td>
            </tr>
          ))}

          {!loading && displayRows.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-slate-500">
                No managers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
