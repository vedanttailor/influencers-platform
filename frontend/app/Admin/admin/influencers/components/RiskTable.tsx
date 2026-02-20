const risks = [
  { name: "FakeQueen", reason: "0.3% engagement", action: "Review" },
  { name: "SpamBoy", reason: "KYC Pending", action: "Suspend" },
];

export default function RiskTable() {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="font-semibold mb-4">High Risk Influencers</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th>Name</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {risks.map((r) => (
            <tr key={r.name} className="border-t">
              <td>{r.name}</td>
              <td>{r.reason}</td>
              <td className="text-red-500">{r.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
