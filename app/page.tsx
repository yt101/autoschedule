"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function handleCheckout(plan: "monthly" | "yearly") {
    if (isCheckingOut) return;

    try {
      setIsCheckingOut(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        console.error("Checkout error:", await res.text());
        alert("Something went wrong starting checkout. Please try again.");
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Stripe did not return a checkout URL.");
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error starting checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  }
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute top-40 -left-10 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      {/* Page content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Nav */}
        <header className="w-full border-b border-white/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
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

            <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              <a href="#features" className="hover:text-amber-300">
                Features
              </a>
              <a href="#use-cases" className="hover:text-amber-300">
                Use cases
              </a>
              <a href="#pricing" className="hover:text-amber-300">
                Pricing
              </a>
              <a href="#faq" className="hover:text-amber-300">
                FAQ
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/app"
                className="hidden rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-amber-400 hover:text-amber-200 md:inline-block"
              >
                Open app
              </Link>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 border border-amber-500/40">
                MVP • In private beta
              </span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="flex flex-1 items-center">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 md:flex-row md:items-center md:py-20">
            {/* Left: copy */}
            <div className="w-full md:w-1/2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-100">
                <span>✨ New</span>
                <span className="h-1 w-1 rounded-full bg-amber-300" />
                <span>Launch your day like a ritual</span>
              </div>

              <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Your digital
                <span className="bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-300 bg-clip-text text-transparent">
                  {" "}
                  "Open Sesame"
                </span>
                .
              </h1>

              <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
                SesameTab opens the tabs and windows you need every day — at the
                exact time you choose, with a calm delay between each one. No
                more frantic morning clicking. Just click once, and let your
                workspace unfold like a ritual.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-400/30 hover:bg-amber-300"
                >
                  ✨ Open SesameTab
                </Link>
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-amber-200"
                >
                  <span>See how it works</span>
                  <span className="text-lg">▶</span>
                </a>
              </div>

              <div className="mt-6 flex flex-col gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-amber-300">•</span>
                  <span>Schedule once, reuse every morning.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300">•</span>
                  <span>
                    Perfect for traders, creators, students, and remote teams.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300">•</span>
                  <span>No installs required for the MVP.</span>
                </div>
              </div>
            </div>

            {/* Right: mock "sequence" card */}
            <div
              id="demo"
              className="w-full md:w-1/2 md:pl-8 flex justify-center"
            >
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-xl shadow-black/40 backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Sesame sequence
                  </p>
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-200">
                    Example: Morning Markets
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <SequenceRow
                    index={1}
                    label="CNBC US Homepage"
                    url="https://www.cnbc.com/world/?region=usa"
                    time="+0s"
                  />
                  <SequenceRow
                    index={2}
                    label="Gold markets"
                    url="https://www.cnbc.com/gold/"
                    time="+2s"
                  />
                  <SequenceRow
                    index={3}
                    label="Futures & commodities"
                    url="https://www.cnbc.com/futures-and-commodities/"
                    time="+4s"
                  />
                  <SequenceRow
                    index={4}
                    label="Broker / charts"
                    url="https://your-broker-or-tradingview.com"
                    time="+6s"
                  />
                </div>

                <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100">
                  At 9:00 AM, SesameTab opens each tab with a gentle{" "}
                  <span className="font-semibold">2s delay</span> so your
                  browser doesn&apos;t feel like a virus attack.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="border-t border-white/10 bg-slate-950/80"
        >
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-50">
                  Designed for calm, intentional openings
                </h2>
                <p className="mt-1 max-w-xl text-sm text-slate-400">
                  SesameTab doesn&apos;t just blast 10 tabs at once. It opens
                  your digital world with intention, timing, and rhythm — like a
                  homa ritual for your browser.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                title="Schedule once, reuse daily"
                emoji="⏰"
                body="Pick your time, paste your URLs, choose how many windows, and SesameTab remembers the routine. Just keep the page open and let it work."
              />
              <FeatureCard
                title="Gentle, delayed openings"
                emoji="🌊"
                body="Set a delay in seconds between each tab. Your browser stays calm, and you never feel like a popup storm just hit your screen."
              />
              <FeatureCard
                title="Works with anything"
                emoji="🌐"
                body="CNBC, TradingView, Notion, YouTube Studio, Google Docs, dashboards, learning portals — if it has a URL, SesameTab can weave it into your ritual."
              />
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section
          id="use-cases"
          className="border-t border-white/10 bg-slate-950/90"
        >
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl font-semibold text-slate-50">
              One magic phrase. Infinite routines.
            </h2>
            <p className="mt-1 max-w-xl text-sm text-slate-400">
              Different people, same pattern: a bunch of tabs they open every
              single day. SesameTab turns that repetition into a ritual.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <UseCaseCard
                title="Traders"
                body="Pre-market: CNBC, futures, gold, broker, charts, economic calendar — all ready before the bell."
              />
              <UseCaseCard
                title="Creators"
                body="YouTube Studio, analytics, script doc, Canva, music library, project board — one click, full studio."
              />
              <UseCaseCard
                title="Students"
                body="Lecture video, slides, homework, reference PDF, spaced-repetition app — open at 7 PM study time."
              />
              <UseCaseCard
                title="Remote teams"
                body="Slack, Jira, Notion, CRM, dashboards, email — your shift starts with every tool in place."
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t border-white/10 bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl font-semibold text-slate-50">
              Simple pricing for daily magic
            </h2>
            <p className="mt-1 max-w-xl text-sm text-slate-400">
              Start with a 3-day free trial. If SesameTab becomes part of your
              daily ritual, keep it running for less than the price of a coffee.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {/* Trial / Starter info */}
              <div className="flex flex-col rounded-2xl border border-white/15 bg-slate-900/70 p-6">
                <h3 className="text-lg font-semibold text-slate-50">
                  3-Day Trial Ritual
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Try SesameTab with your real routine for three days.
                </p>
                <div className="mt-4 text-3xl font-semibold text-slate-50">
                  $0
                  <span className="text-sm font-normal text-slate-400">
                    / first 3 days
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  <li>• Full Pro features for 3 days</li>
                  <li>• Great for testing Morning Markets or Deep Work rituals</li>
                  <li>• Cancel anytime during the trial</li>
                </ul>
                <div className="mt-6">
                  <button
                    onClick={() => handleCheckout("monthly")}
                    disabled={isCheckingOut}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-white/25 px-4 py-2 text-sm font-medium text-slate-50 hover:border-amber-400 hover:text-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? "Loading..." : "Start 3-day trial → Monthly"}
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-slate-500">
                  Trial handled by Stripe. You can cancel before it renews.
                </p>
              </div>

              {/* Pro */}
              <div className="flex flex-col rounded-2xl border border-amber-400/60 bg-gradient-to-b from-slate-900/80 via-slate-900/80 to-slate-950 p-6 shadow-lg shadow-amber-500/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-amber-50">
                    SesameTab Pro
                  </h3>
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-medium text-amber-100">
                    Best for daily users
                  </span>
                </div>
                <p className="mt-1 text-sm text-amber-100/80">
                  For traders, creators, and deep workers who live by rituals.
                </p>
                <div className="mt-4">
                  <div className="flex items-baseline gap-3">
                    <div className="text-3xl font-semibold text-amber-50">
                      $4.99
                      <span className="text-sm font-normal text-amber-100/80">
                        /month
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-amber-100/80">
                    Or pay annually and get ~10% off.
                  </p>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-amber-50/90">
                  <li>• Unlimited routines</li>
                  <li>• Unlimited URLs per routine*</li>
                  <li>• Custom delays and presets</li>
                  <li>• Export to OS scripts (coming soon)</li>
                  <li>• Priority for new features</li>
                </ul>
                <p className="mt-2 text-[10px] text-amber-100/70">
                  *Within the practical limits of your browser and computer.
                  Please use responsibly and in line with each site&apos;s terms.
                </p>
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => handleCheckout("monthly")}
                    disabled={isCheckingOut}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-amber-400/40 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? "Loading..." : "Go Pro – Monthly"}
                  </button>
                  <button
                    onClick={() => handleCheckout("yearly")}
                    disabled={isCheckingOut}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-amber-400/70 px-4 py-2 text-xs font-medium text-amber-50 hover:bg-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? "Loading..." : "Go Pro – Annual (10% off)"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="border-t border-white/10 bg-slate-950/95"
        >
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl font-semibold text-slate-50">
              Questions, before you say the words?
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <FAQItem
                q="Do I have to keep the SesameTab page open?"
                a="For the current MVP, yes. Your browser needs to stay open so the scheduled JavaScript can trigger and open your tabs. A future Chrome extension and desktop agent will handle this in the background."
              />
              <FAQItem
                q="Will this feel like a popup storm?"
                a="No. You control the delay between each tab or window opening, so tabs can appear one by one every few seconds instead of all at once."
              />
              <FAQItem
                q="Does SesameTab work with any website?"
                a="Yes. If it has a URL, you can add it to your ritual: news, trading platforms, dashboards, Notion, YouTube, docs, learning portals, and more."
              />
              <FAQItem
                q="Is this safe and private?"
                a="SesameTab runs entirely in your browser for the MVP. Your URLs live in local state on your machine. Later versions will clearly explain how routines are stored and synced."
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-slate-950">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 md:flex-row">
            <p>© {new Date().getFullYear()} SesameTab. All rights reserved.</p>
            <p className="text-[11px] text-slate-500">
              Built for people who believe their day deserves a ritual, not a
              scramble.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}

function SequenceRow(props: {
  index: number;
  label: string;
  url: string;
  time: string;
}) {
  return (
    <div className="flex items-start justify-between rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[11px] font-semibold text-amber-200">
          {props.index}
        </span>
        <div>
          <div className="text-xs font-medium text-slate-100">
            {props.label}
          </div>
          <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
            {props.url}
          </div>
        </div>
      </div>
      <span className="text-[10px] text-amber-200">{props.time}</span>
    </div>
  );
}

function FeatureCard(props: { title: string; emoji: string; body: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{props.emoji}</span>
        <h3 className="text-sm font-semibold text-slate-50">{props.title}</h3>
      </div>
      <p className="text-xs text-slate-400">{props.body}</p>
    </div>
  );
}

function UseCaseCard(props: { title: string; body: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <h3 className="text-sm font-semibold text-slate-50">{props.title}</h3>
      <p className="mt-2 text-xs text-slate-400">{props.body}</p>
    </div>
  );
}

function FAQItem(props: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <h3 className="text-sm font-semibold text-slate-50">{props.q}</h3>
      <p className="mt-2 text-xs text-slate-400">{props.a}</p>
    </div>
  );
}

