export default function OverviewTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div className="md:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="font-semibold mb-4">Company Profile</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><b>Company Name:</b> Acme Corporation</p>
          <p><b>Industry:</b> Fashion</p>
          <p><b>Website:</b> acme.com</p>
          <p><b>GST ID:</b> 24ABCDE1234F</p>
          <p><b>Contact Person:</b> Rahul Shah</p>
          <p><b>Email:</b> rahul@acme.com</p>
        </div>
      </div>

      
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
    </div>
  );
}
