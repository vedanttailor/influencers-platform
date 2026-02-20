export default function FinancialTab() {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
      <h2 className="font-semibold">Financial Health</h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <p><b>Total Spend:</b> ₹12,40,000</p>
        <p><b>Avg Campaign Budget:</b> ₹1,03,000</p>
        <p><b>Highest Spend:</b> ₹3,20,000</p>
        <p><b>Failed Payments:</b> 2</p>
        <p><b>Payment Status:</b> Pending</p>
        <p><b>Last Payment:</b> 08 Jan 2026</p>
      </div>

      <div className="mt-4">
        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
          Medium Financial Risk
        </span>
      </div>
    </div>
  );
}
