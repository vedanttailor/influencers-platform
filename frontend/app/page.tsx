import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#020617" }}
    >
      <div
        className="text-center"
        style={{ color: "white" }}
      >
        <h1 className="text-5xl font-bold mb-4">
          Influencer Marketplace
        </h1>

        <p className="text-lg mb-8">
          Connect brands with creators. Run campaigns. Track results.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            style={{
              backgroundColor: "white",
              color: "#4f46e5"
            }}
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg font-semibold"
            style={{
              border: "1px solid white",
              color: "white"
            }}
          >
            Signup
          </Link>
        </div>
      </div>
    </main>
  );
} 