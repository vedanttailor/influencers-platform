import Link from "next/link";
import { useClient } from "./ClientContext";

export default function ClientHeader() {
  const data = useClient();

  const initials = data.client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <Link href="/Admin/client" className="text-sm text-gray-500 mb-3 inline-block">
         ← Back to Clients
      </Link>

      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg">
            {initials}
          </div>

          <div>
            <h1 className="text-xl font-semibold">{data.client.company_name || data.client.name}</h1>
            <p className="text-sm text-gray-500">
              Client • {data.client.status}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 text-sm rounded-full ${
          data.client.status === 'active' ? 'bg-green-100 text-green-700' : data.client.status === 'suspended' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
        }`}>
          {data.client.status} Client
        </span>
      </div>


    </div>
  );
}
