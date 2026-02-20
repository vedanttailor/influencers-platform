import StatusBadge from "./StatusBadge";

export default function CampaignTable() {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold mb-3">Campaigns</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-left">
            <th>Name</th>
            <th>Status</th>
            <th>Start</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="py-2">Skincare Launch</td>
            <td><StatusBadge status="ready" /></td>
            <td>10 Jan</td>
          </tr>
          <tr className="border-t">
            <td className="py-2">Tech Review</td>
            <td><StatusBadge status="completed" /></td>
            <td>5 Jan</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
