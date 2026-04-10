import ManagerTable from "../components/managers/ManagerTable";
import Link from "next/link";

export default function ManagerPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Managers
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Create and manage platform managers.
          </p>
        </div>

        <Link
          href="/Admin/manager/create"
          className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          + Add Manager
        </Link>
      </div>

      <ManagerTable />
    </div>
  );
}
