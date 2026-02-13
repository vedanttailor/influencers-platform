import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 to-purple-700">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">
          Influencer Marketplace
        </h1>
        <p className="text-lg mb-8">
          Connect brands with creators. Run campaigns. Track results.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600"
          >
            Signup
          </Link>
        </div>
      </div>
    </main>
  );
}
