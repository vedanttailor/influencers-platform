/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useManagers } from "../admin/manager/ManagerContext";
import StatusBadge from "../admin/dashboard/StatusBadge";
import { FiLock, FiUnlock } from "react-icons/fi";

export default function ManagerTable() {
  const { managers, toggleStatus } = useManagers();

  return (
    <div className="bg-white rounded shadow p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-left">
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>CRM</th>
            <th>Campaigns</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {managers.map((m) => (
            <tr key={m.id} className="border-t">
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.email}</td>

              <td>
                {m.permissions.crm ? (
                  <FiUnlock className="text-green-600 text-lg" />
                ) : (
                  <FiLock className="text-red-500 text-lg" />
                )}
              </td>

              <td>
                {m.permissions.campaigns ? (
                  <FiUnlock className="text-green-600 text-lg" />
                ) : (
                  <FiLock className="text-red-500 text-lg" />
                )}
              </td>

              <td onClick={() => toggleStatus(m.id)} className="cursor-pointer">
                <StatusBadge status={m.status as any} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
