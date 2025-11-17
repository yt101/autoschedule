import { useState } from "react";
import type { ScheduleState } from "../types";

export const useWindowLauncher = () => {
  const [status, setStatus] = useState<string>("");
  const [countdown, setCountdown] = useState<string>("");
  const [schedule, setSchedule] = useState<ScheduleState>({
    targetTime: null,
    urls: [],
    numWindows: 0,
    delaySeconds: 0,
  });

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

  return {
    status,
    countdown,
    schedule,
    setStatus,
    setCountdown,
    setSchedule,
    launchWindowsSequentially,
  };
};

