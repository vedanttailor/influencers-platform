import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_64px_-28px_rgba(15,23,42,0.25)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_15%_0%,rgba(45,212,191,0.16),transparent_55%),radial-gradient(ellipse_55%_40%_at_95%_0%,rgba(56,189,248,0.12),transparent_55%)]" />

          <div className="relative grid gap-10 p-8 sm:p-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-12">
            <div>
              <p className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600 backdrop-blur">
                Influencer Platform
              </p>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Run creator campaigns with clarity.
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Connect brands with creators, manage briefs and approvals, and track
                performance—across admins, managers, clients, and influencers.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  Sign in
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
                >
                  Create account
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="card p-5">
                <p className="text-sm font-semibold text-slate-900">Clients</p>
                <p className="mt-1 text-sm text-slate-600">
                  Launch campaigns, review applicants, and monitor results.
                </p>
              </div>

              <div className="card p-5">
                <p className="text-sm font-semibold text-slate-900">Influencers</p>
                <p className="mt-1 text-sm text-slate-600">
                  Apply to campaigns, deliver content, and track earnings.
                </p>
              </div>

              <div className="card p-5 sm:col-span-2 lg:col-span-1">
                <p className="text-sm font-semibold text-slate-900">
                  Managers & Admins
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Oversee operations, users, and approvals in one workspace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
