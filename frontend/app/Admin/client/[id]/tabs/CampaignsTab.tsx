const campaigns = [
  {
    name: "Winter Sale",
    platforms: "Instagram, YouTube",
    budget: "₹1,00,000",
    reach: "450K",
    success: "78%",
    issues: "None",
  },
  {
    name: "Festive Drop",
    platforms: "Instagram",
    budget: "₹80,000",
    reach: "210K",
    success: "65%",
    issues: "Late approval",
  },
];

export default function CampaignsTab() {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="font-semibold mb-4">Campaign History</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              {["Campaign", "Platforms", "Budget", "Reach", "Success", "Issues"].map(
                (h) => (
                  <th key={h} className="p-3 text-left border">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.name} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.platforms}</td>
                <td className="p-3">{c.budget}</td>
                <td className="p-3">{c.reach}</td>
                <td className="p-3">{c.success}</td>
                <td className="p-3">{c.issues}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
