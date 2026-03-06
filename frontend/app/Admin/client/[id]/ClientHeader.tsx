import Link from "next/link";

export default function ClientHeader() {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      

      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
            AC
          </div>

          <div>
            <h1 className="text-xl font-semibold">Acme Corporation</h1>
            <p className="text-sm text-gray-500">
              E-Commerce • Account Age: 1 year 3 months
            </p>
          </div>
        </div>

        <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
          Active Client
        </span>
      </div>

      <Link
        href="/admin/client"
        className="text-sm text-gray-500 mb-3 inline-block"
      >
         Back to Clients
      </Link>

    </div>
  );
}
