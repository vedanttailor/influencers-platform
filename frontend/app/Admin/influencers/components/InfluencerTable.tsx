import Link from "next/link";

const influencers = [
  { id: 1, name: "Sunny Bhavsar", platform: "Instagram", followers: 120000, score: 4.6 },
  { id: 2, name: "Priya Shah", platform: "YouTube", followers: 98000, score: 4.2 },
];

export default function InfluencerTable() {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Top Performers</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th>Name</th>
            <th>Platform</th>
            <th>Followers</th>
            <th>Score</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {influencers.map((i) => (
            <tr key={i.id} className="border-t">
              <td>{i.name}</td>
              <td>{i.platform}</td>
              <td>{i.followers}</td>
              <td>⭐ {i.score}</td>
              <td>
                <Link
                  href={`/admin/influencers/${i.id}`}
                  className="text-blue-600"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
