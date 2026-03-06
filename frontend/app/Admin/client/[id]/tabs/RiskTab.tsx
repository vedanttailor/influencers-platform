export default function RiskTab() {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
      <h2 className="font-semibold">Risk & Behavior</h2>

      <ul className="text-sm space-y-2">
        <li>⚠️ Campaign Cancellations: 1</li>
        <li>⏰ Late Approvals: 3</li>
        <li>🚫 Content Violations: 0</li>
        <li>📣 Influencer Complaints: 2</li>
      </ul>

      <div className="flex gap-2 mt-4">
        {["Payment Risk", "Approval Delay"].map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
    