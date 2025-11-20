// app/app/page.tsx

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function getHostnameSafe(u: string): string {
  if (!u) return "";

  try {
    // If user didn't include a scheme, assume https://
    const maybeUrl = u.startsWith("http://") || u.startsWith("https://")
      ? u
      : `https://${u}`;

    const url = new URL(maybeUrl);
    return url.hostname.replace(/^www\./, "");
  } catch {
    // Fallback: show a truncated raw string instead of crashing
    return u.length > 30 ? u.slice(0, 30) + "…" : u;
  }
}

type ScheduleState = {
  targetTime: Date | null;
  urls: string[];
  numWindows: number;
  delaySeconds: number;
  routineName: string;
};

export default function SesameTabAppPage() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";

  const demoUrls = [
    "https://www.cnbc.com/world/?region=usa",
    "https://www.cnbc.com/gold/",
    "https://www.cnbc.com/futures-and-commodities/",
  ];

  const [routineName, setRoutineName] = useState(
    isDemo ? "Morning Markets (Demo)" : "Morning Markets"
  );
  const [timeInput, setTimeInput] = useState("09:00");
  const [numWindows, setNumWindows] = useState(isDemo ? 3 : 3);
  const [delaySeconds, setDelaySeconds] = useState(2);
  const [urlsText, setUrlsText] = useState(() =>
    (isDemo ? demoUrls : demoUrls).join("\n")
  );

  const handleGoPro = async (billing: "monthly" | "yearly" = "monthly") => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: billing === "yearly" ? "pro_yearly" : "pro_monthly",
        }),
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
        alert("No checkout URL returned.");
      }
    } catch (e) {
      console.error("Checkout request failed:", e);
      alert("Network error starting checkout.");
    }
  };

  const [schedule, setSchedule] = useState<ScheduleState>({
    targetTime: null,
    urls: [],
    numWindows: 0,
    delaySeconds: 0,
    routineName: "",
  });

  const [status, setStatus] = useState<string>(
    "No active schedule. Set a ritual on the left."
  );

  const [countdown, setCountdown] = useState<string>("");

  // Parse URLs and compute how they will be repeated based on numWindows
  const previewUrls: string[] = useMemo(() => {
    const rawUrls = urlsText
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (rawUrls.length === 0 || numWindows <= 0) return [];

    const finalCount = numWindows;

    const expanded: string[] = [];

    for (let i = 0; i < finalCount; i++) {
      expanded.push(rawUrls[i % rawUrls.length]);
    }

    return expanded;
  }, [urlsText, numWindows]);

  // When schedule is active, compute how it will open (for the right-side preview)
  const scheduledPreview: string[] = useMemo(() => {
    if (!schedule.targetTime || schedule.numWindows <= 0 || schedule.urls.length === 0) {
      return [];
    }

    const expanded: string[] = [];

    for (let i = 0; i < schedule.numWindows; i++) {
      expanded.push(schedule.urls[i % schedule.urls.length]);
    }

    return expanded;
  }, [schedule]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!timeInput) {
      alert("Please enter a time (e.g., 09:00).");
      return;
    }

    const [hourStr, minuteStr] = timeInput.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      alert("Invalid time format. Use HH:MM.");
      return;
    }

    const now = new Date();
    const target = new Date();
    target.setHours(hour, minute, 0, 0);

    // If time already passed today, schedule for tomorrow
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    const rawUrls = urlsText
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (rawUrls.length === 0) {
      setStatus("Enter at least one URL.");
      return;
    }

    const n = numWindows > 0 ? numWindows : rawUrls.length;
    const d = delaySeconds >= 0 ? delaySeconds : 0;
    const name = routineName.trim() || "SesameTab Ritual";

    setSchedule({
      targetTime: target,
      urls: rawUrls,
      numWindows: n,
      delaySeconds: d,
      routineName: name,
    });

    setStatus(
      `Scheduled "${name}" to open up to ${n} window(s) at ${target.toLocaleTimeString()} on ${target.toLocaleDateString()}. Delay: ${d}s between openings.`
    );

    setCountdown("");
  };

  const launchWindowsSequentially = (state: ScheduleState) => {
    if (state.numWindows <= 0 || state.urls.length === 0) {
      setStatus("Nothing to open — please provide URLs and number of windows.");
      return;
    }

    setStatus("Launching windows...");

    // Build expanded URL list based on desired count
    const urlsToOpen: string[] = [];

    for (let i = 0; i < state.numWindows; i++) {
      urlsToOpen.push(state.urls[i % state.urls.length]);
    }

    const delayMs = Math.max(0, state.delaySeconds) * 1000;

    const openAtIndex = (index: number) => {
      if (index >= urlsToOpen.length) {
        setStatus(
          `Done. Opened ${urlsToOpen.length} window(s). If popups were blocked, check your browser bar.`
        );

        setCountdown("");

        setSchedule((prev) => ({
          ...prev,
          // keep schedule.targetTime? you can decide – here we clear it
          targetTime: null,
          urls: prev.urls,
          numWindows: prev.numWindows,
          delaySeconds: prev.delaySeconds,
        }));

        return;
      }

      const url = urlsToOpen[index];
      window.open(url, "_blank", "noopener,noreferrer");

      if (delayMs > 0) {
        window.setTimeout(() => openAtIndex(index + 1), delayMs);
      } else {
        openAtIndex(index + 1);
      }
    };

    openAtIndex(0);
  };

  // Schedule countdown + trigger
  useEffect(() => {
    if (!schedule.targetTime) return;

    const interval = window.setInterval(() => {
      const now = new Date();
      const diffMs = schedule.targetTime!.getTime() - now.getTime();

      if (diffMs <= 0) {
        window.clearInterval(interval);
        launchWindowsSequentially(schedule);
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const parts: string[] = [];

      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setCountdown("Time remaining: " + parts.join(" "));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [schedule]);

  const launchNow = () => {
    const rawUrls = urlsText
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (rawUrls.length === 0) {
      alert("Please enter at least one URL.");
      return;
    }

    const n = numWindows > 0 ? numWindows : rawUrls.length;
    const d = delaySeconds >= 0 ? delaySeconds : 0;
    const name = routineName.trim() || "SesameTab Ritual";

    const tempSchedule: ScheduleState = {
      targetTime: null,
      urls: rawUrls,
      numWindows: n,
      delaySeconds: d,
      routineName: name,
    };

    launchWindowsSequentially(tempSchedule);
  };

  const upcomingLabel = useMemo(() => {
    if (!schedule.targetTime) return "No active schedule";

    const now = new Date();
    const target = schedule.targetTime;

    const isToday =
      now.toDateString() === target.toDateString() ? "Today" : "Tomorrow";

    return `${isToday} at ${target.toLocaleTimeString()}`;
  }, [schedule.targetTime]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute top-40 -left-10 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 md:py-12">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center rounded-lg border border-white/15 px-2 py-1 text-[11px] text-slate-300 hover:border-amber-400 hover:text-amber-200"
              >
                ← Home
              </Link>
              <div>
                <h1 className="text-lg font-semibold md:text-xl">
                  SesameTab Ritual {isDemo && <span className="text-xs text-amber-300">(Demo)</span>}
                </h1>
                <p className="mt-1 text-xs text-slate-400 md:text-sm">
                  Set the time and rhythm for your opening sequence. Keep this page open and
                  let your ritual unfold.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-100 border border-amber-400/40">
                MVP • Local only
              </span>
              <button
                type="button"
                onClick={handleGoPro}
                className="inline-flex items-center rounded-lg bg-amber-400 px-3 py-1.5 text-[11px] font-semibold text-slate-950 shadow-md shadow-amber-400/40 hover:bg-amber-300"
              >
                ⭐ Go Pro
              </button>
            </div>
          </div>

          {/* Main card */}
          <div className="flex flex-1 flex-col gap-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg md:flex-row md:p-6">
            {/* Left: Form */}
            <div className="w-full md:w-1/2 md:pr-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-200">
                    Routine name (optional)
                  </label>
                  <input
                    type="text"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    disabled={isDemo}
                    className="mt-1 w-full rounded-md border border-white/15 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                    placeholder="Morning Markets, Deep Work, Creator Studio..."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-200">
                      Start time (local)
                    </label>
                    <input
                      type="time"
                      value={timeInput}
                      onChange={(e) => setTimeInput(e.target.value)}
                      disabled={isDemo}
                      className="mt-1 w-full rounded-md border border-white/15 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                    />
                    <p className="mt-1 text-[10px] text-slate-400">
                      If this time has passed, SesameTab will schedule for tomorrow.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-200">
                      Number of windows / tabs
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={numWindows}
                      onChange={(e) => {
                        if (isDemo) return; // lock in demo mode
                        setNumWindows(Math.max(1, Number(e.target.value) || 1));
                      }}
                      disabled={isDemo}
                      className={`mt-1 w-full rounded-md border border-white/15 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 ${isDemo ? "opacity-50 pointer-events-none" : ""}`}
                    />
                    <p className="mt-1 text-[10px] text-slate-400">
                      {isDemo
                        ? "In demo mode, this ritual uses 3 windows."
                        : "If you request more than your URLs, they'll repeat in order."}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200">
                    Delay between openings (seconds)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={delaySeconds}
                    onChange={(e) =>
                      setDelaySeconds(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="mt-1 w-full rounded-md border border-white/15 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                  />
                  <p className="mt-1 text-[10px] text-slate-400">
                    Use 1–3 seconds to avoid a &quot;popup storm&quot; feeling.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200">
                    URLs in this ritual (one per line)
                  </label>
                  <textarea
                    value={urlsText}
                    onChange={(e) => {
                      if (isDemo) return; // lock in demo mode
                      setUrlsText(e.target.value);
                    }}
                    disabled={isDemo}
                    rows={6}
                    className={`mt-1 w-full rounded-md border border-white/15 bg-slate-950/60 px-3 py-2 text-xs font-mono text-slate-100 ${isDemo ? "opacity-50 pointer-events-none" : ""}`}
                  />
                  <p className="mt-1 text-[10px] text-slate-400">
                    {isDemo
                      ? "Demo mode: URLs are fixed so you can see SesameTab in action."
                      : "Example: CNBC, TradingView, Notion, dashboards, YouTube, docs…"}
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-amber-400/40 hover:bg-amber-300"
                  >
                    ✨ Start schedule
                  </button>
                  <button
                    type="button"
                    onClick={launchNow}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-xs font-medium text-slate-100 hover:border-amber-400 hover:text-amber-200"
                  >
                    ⚡ Launch now (ignore schedule)
                  </button>
                </div>

                <p className="mt-2 text-[10px] text-slate-500">
                  Keep this page open and allow pop-ups for SesameTab so your
                  ritual can open the windows for you.
                </p>
              </form>

              {/* Stripe Checkout Button */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/checkout-monthly", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                      });

                      if (!res.ok) {
                        const error = await res.json();
                        alert(error.error || "Something went wrong starting checkout.");
                        return;
                      }

                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        alert("No checkout URL returned.");
                      }
                    } catch (err) {
                      console.error("Checkout error:", err);
                      alert("Unable to start checkout. Please try again.");
                    }
                  }}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-amber-400/40 hover:bg-amber-300"
                >
                  ⭐ Go Pro - Start 3-day trial
                </button>
              </div>
            </div>

            {/* Right: Preview & status */}
            <div className="w-full md:w-1/2 md:pl-4 mt-4 md:mt-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-50">
                    Ritual overview
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {schedule.targetTime
                      ? `Next run: ${upcomingLabel}`
                      : "No active schedule yet."}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">
                <p className="text-xs font-medium text-slate-200">Status</p>
                <p className="mt-1 text-[11px] text-slate-300">{status}</p>
                {countdown && (
                  <p className="mt-1 text-[11px] text-amber-200">{countdown}</p>
                )}
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-3">
                <p className="text-xs font-medium text-slate-200 mb-2">
                  Sequence preview
                </p>
                <div className="space-y-2 max-h-64 overflow-auto pr-1">
                  {previewUrls.length === 0 ? (
                    <p className="text-[11px] text-slate-400">
                      Add URLs and a number of windows on the left to see how your
                      ritual will open.
                    </p>
                  ) : (
                    previewUrls.slice(0, 8).map((u, idx) => {
                      let hostname = u;
                      try {
                        hostname = new URL(u).hostname.replace("www.", "");
                      } catch {
                        // leave hostname as the raw string or a fallback
                        hostname = u || "URL";
                      }

                      return (
                        <div
                          key={idx}
                          className="flex items-start justify-between rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2"
                        >
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[11px] font-semibold text-amber-200">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="text-[11px] font-medium text-slate-100">
                                {hostname}
                              </div>
                              <div className="max-w-[200px] truncate text-[10px] text-slate-400">
                                {u}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-amber-200">
                            +{idx * delaySeconds}s
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
                {previewUrls.length > 8 && (
                  <p className="mt-1 text-[10px] text-slate-500">
                    Showing first 8 of {previewUrls.length} openings.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleGoPro("monthly")}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-amber-400/40 hover:bg-amber-300"
              >
                💳 Go Pro (unlock full control)
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
