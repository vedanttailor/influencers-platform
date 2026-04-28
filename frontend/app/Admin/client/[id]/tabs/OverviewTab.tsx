import { useClient } from "../ClientContext";

export default function OverviewTab() {
  const data = useClient();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div className="md:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="font-semibold mb-4">Company Profile</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><b>Company Name:</b> {data.client.company_name || data.client.name}</p>
          <p><b>Industry:</b> N/A</p>
          <p><b>Website:</b> N/A</p>
          <p><b>Contact:</b> {data.client.name}</p>
          <p><b>Email:</b> {data.client.email}</p>
          <p><b>Status:</b> <span className={`px-2 py-1 rounded-full text-xs ${data.client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{data.client.status}</span></p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Total Campaigns</p>
          <p className="text-xl font-semibold">{data.stats.total_campaigns}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Active Campaigns</p>
          <p className="text-xl font-semibold">{data.stats.active_campaigns}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Total Spend</p>
          <p className="text-xl font-semibold">₹{data.stats.total_spend.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

      
      <div className="space-y-4">
        {[
          ["Total Campaigns", "12"],
          ["Active Campaigns", "3"],
          ["Total Spend", "₹12,40,000"],
          ["Avg Budget", "₹1,03,000"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white p-4 rounded-xl border shadow-sm"
          >
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>


