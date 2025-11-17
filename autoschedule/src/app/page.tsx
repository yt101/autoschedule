'use client';

import { FormEvent, useEffect, useState } from "react";

type ScheduleState = {
  targetTime: Date | null;
  urls: string[];
  numWindows: number;
  delaySeconds: number;
};

export default function HomePage() {
  const [timeInput, setTimeInput] = useState("09:00"); // HH:MM
  const [numWindows, setNumWindows] = useState(3);
  const [delaySeconds, setDelaySeconds] = useState(2); // delay between openings
  const [urlsText, setUrlsText] = useState(
    [
      "https://www.cnbc.com/world/?region=usa",
      "https://www.cnbc.com/gold/",
      "https://www.cnbc.com/futures-and-commodities/",
    ].join("\n"),
  );

  const [schedule, setSchedule] = useState<ScheduleState>({
    targetTime: null,
    urls: [],
    numWindows: 0,
    delaySeconds: 0,
  });

  const [status, setStatus] = useState<string>("No schedule set yet.");
  const [countdown, setCountdown] = useState<string>("");

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

    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

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

    setSchedule({
      targetTime: target,
      urls: rawUrls,
      numWindows: n,
      delaySeconds: d,
    });

    setStatus(
      `Scheduled to open up to ${n} window(s) at ${target.toLocaleTimeString()} on ${target.toLocaleDateString()}. Delay between openings: ${d} second(s).`,
    );
    setCountdown("");
  };

  const launchWindowsSequentially = (state: ScheduleState) => {
    if (!state.urls.length || state.numWindows <= 0) {
      setStatus("Nothing to open — no URLs or zero windows requested.");
      return;
    }

    setStatus("Launching windows...");

    const urlsToOpen = state.urls.slice(0, state.numWindows);
    const delayMs = Math.max(0, state.delaySeconds) * 1000;

    const openAtIndex = (index: number) => {
      if (index >= urlsToOpen.length) {
        setStatus(
          `Done. Opened ${urlsToOpen.length} window(s). If popups were blocked, check your browser bar.`,
        );
        setCountdown("");
        setSchedule({
          targetTime: null,
          urls: [],
          numWindows: 0,
          delaySeconds: 0,
        });
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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Scheduled Browser Launcher (with Delay)
        </h1>
        <p className="text-sm text-gray-600 text-center">
          Enter a time, number of windows, delay between openings, and a list of
          URLs. Keep this page open and allow pop-ups. At the scheduled time, it
          will open the URLs in new tabs/windows, one by one.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Time (local)
            </label>
            <input
              type="time"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Number of windows / tabs to open
              <span className="text-gray-500 text-xs ml-1">(used as a cap)</span>
            </label>
            <input
              type="number"
              min={1}
              value={numWindows}
              onChange={(e) => setNumWindows(Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Delay between openings (seconds)
            </label>
            <input
              type="number"
              min={0}
              value={delaySeconds}
              onChange={(e) => setDelaySeconds(Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: 2 seconds = each new window opens 2 seconds after the
              previous one, instead of all at once.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              URLs (one per line)
            </label>
            <textarea
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              rows={6}
              className="w-full border rounded-md px-3 py-2 text-sm font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-black text-white text-sm font-semibold hover:bg-gray-800"
          >
            Start Schedule
          </button>
        </form>

        <div className="border-t pt-4 text-sm">
          <p className="font-semibold">Status</p>
          <p className="text-gray-700">{status}</p>
          {countdown && <p className="mt-1 text-blue-600">{countdown}</p>}
          <p className="mt-2 text-xs text-gray-500">
            ⚠️ Keep this page open. If your browser blocks pop-ups, you may need
            to allow them for this site so the windows can open.
          </p>
        </div>
      </div>
    </main>
  );
}
