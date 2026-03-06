export default function AdminActionsTab() {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
      <h2 className="font-semibold">Admin Controls</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "Approve Client",
          "Suspend Client",
          "Limit Campaign Creation",
          "Require Pre-Payment",
          "Blacklist Client",
        ].map((action) => (
          <button
            key={action}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm"
          >
            {action}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        ⚠ All actions are logged with admin ID and timestamp.
      </p>
    </div>
  );
}
