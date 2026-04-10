type Status = "active" | "ready" | "suspended" | "completed" | "banned";

export default function StatusBadge({ status }: { status: Status | string }) {
  const colors: Record<Status, string> = {
    active: "bg-green-100 text-green-700",
    ready: "bg-blue-100 text-blue-700",
    suspended: "bg-yellow-100 text-yellow-700",
    completed: "bg-gray-200 text-gray-700",
    banned: "bg-red-100 text-red-700",
  };

  const normalized = String(status || "").toLowerCase().trim();
  const badgeClass =
    (colors as Record<string, string>)[normalized] ||
    (normalized === "rejected"
      ? "bg-rose-100 text-rose-700"
      : "bg-slate-100 text-slate-700");

  return (
    <span className={`rounded px-2 py-1 text-sm ${badgeClass}`}>
      {normalized || "unknown"}
    </span>
  );
}
