import StatusBadge from "./StatusBadge";

function ActionMenu() {
  return (
    <div className="relative inline-block text-left">
      <button className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800">⋮</button>
      
      <div className="hidden absolute right-0 mt-2 w-40 bg-white border rounded shadow">
        <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100">View</button>
        <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100">Edit</button>
        <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100">Disable</button>
      </div>
    </div>
  );
}

export default function UsersTable() {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold mb-3">Users</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-left">
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="py-2">Riya</td>
            <td>Influencer</td>
            <td><StatusBadge status="active" /></td>
            <td><ActionMenu /></td>
          </tr>
          <tr className="border-t">
            <td className="py-2">Ved</td>
            <td>Manager</td>
            <td><StatusBadge status="ready" /></td>
            <td><ActionMenu /></td>
          </tr>
           <tr className="border-t">
            <td className="py-2">Mak</td>
            <td>Client</td>
            <td><StatusBadge status="suspended" /></td>
            <td><ActionMenu /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
