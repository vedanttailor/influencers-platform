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
      <option value="complete">Complete</option>
    </select>
  );
}

export default function CampaignTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchRows = async () => {
    try {
      const data = await api.get("/admin/campaigns");
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch admin campaigns", e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleAction = async (campaignId: string, action: string) => {
    try {
      setUpdatingId(campaignId);
      await api.patch(`/admin/campaigns/${campaignId}/action`, { action });
      await fetchRows();
    } catch (e) {
      console.error("Failed to apply campaign action", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const displayRows = useMemo(() => rows.slice(0, 6), [rows]);

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">Campaigns</h3>
        <span className="text-xs text-slate-500">
          {loading ? "Loading..." : `${rows.length} total`}
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th>Name</th>
            <th>Status</th>
            <th>Start</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayRows.map((c) => {
            const name = c.campaign_name || c.name || "-";
            const status = String(c.status || "active");
            const start = c.start_date
              ? new Date(c.start_date).toLocaleDateString()
              : "-";

            return (
              <tr key={c.id} className="border-t border-slate-200/70">
                <td className="py-2 font-medium text-slate-900">{name}</td>
                <td>
                  <StatusBadge status={status as any} />
                </td>
                <td className="text-slate-600">{start}</td>
                <td className="text-right">
                  <ActionMenu
                    disabled={updatingId === c.id}
                    onAction={(action) => handleAction(c.id, action)}
                  />
                </td>
              </tr>
            );
          })}

          {!loading && displayRows.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-slate-500">
                No campaigns found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
