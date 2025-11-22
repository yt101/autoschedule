// app/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute top-40 -left-10 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b border-white/10">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-400/40">
                <span className="text-lg">🌱</span>
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide">
                  SesameTab
                </div>
                <div className="text-xs text-slate-400">
                  Your daily "Open Sesame."
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200 hover:border-amber-400 hover:text-amber-200"
            >
              ← Back home
            </Link>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-10">
          <h1 className="text-2xl font-semibold text-slate-50">
            About SesameTab
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            SesameTab is designed to enhance your productivity and focus by
            turning your daily browser habits into intentional rituals. Instead
            of manually opening the same set of tabs every morning, you define
            a ritual once—time, URLs, and rhythm—and let SesameTab open them
            for you in a calm, sequenced way.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            This tool is for people who live in the browser: traders, creators,
            students, remote workers, and teams who rely on a predictable set
            of websites and dashboards to do their best work.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            SesameTab is not affiliated with or endorsed by YouTube, Google, or
            any other third party whose services may be opened in your rituals.
            Users are responsible for complying with the terms of service of
            any platforms they access, including YouTube&apos;s policies around
            views, engagement, and fair use.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
            <h2 className="text-sm font-semibold text-slate-50">
              Company information
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              32 N Gould St<br />
              Sheridan, WY 82801<br />
              United States
            </p>
          </div>

          <p className="mt-6 text-[11px] text-slate-500">
            SesameTab is currently in an early MVP phase. Features, pricing,
            and availability may evolve as we learn from real-world use cases
            (including future neuro-symbolic enhancements for enterprise
            workflows).
          </p>
        </div>
      </div>
    </main>
  );
}

