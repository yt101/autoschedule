import { useState } from "react";
import { useWindowLauncher } from "./components/WindowLauncher";
import type { ScheduleState } from "./types";

function App() {
  const [urls, setUrls] = useState<string>("");
  const [numWindows, setNumWindows] = useState<number>(1);
  const [delaySeconds, setDelaySeconds] = useState<number>(0);

  const { status, countdown, setStatus, launchWindowsSequentially } =
    useWindowLauncher();

  const handleLaunch = () => {
    const urlArray = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urlArray.length === 0) {
      setStatus("Please enter at least one URL.");
      return;
    }

    const state: ScheduleState = {
      urls: urlArray,
      numWindows: Math.max(1, numWindows),
      delaySeconds: Math.max(0, delaySeconds),
      targetTime: null,
    };

    launchWindowsSequentially(state);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Auto Schedule Window Launcher</h1>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="urls" style={{ display: "block", marginBottom: "5px" }}>
          URLs (one per line):
        </label>
        <textarea
          id="urls"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          rows={6}
          style={{
            width: "100%",
            padding: "8px",
            fontFamily: "monospace",
            boxSizing: "border-box",
          }}
          placeholder="https://example.com&#10;https://example.org&#10;https://example.net"
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="numWindows"
          style={{ display: "block", marginBottom: "5px" }}
        >
          Number of Windows:
        </label>
        <input
          id="numWindows"
          type="number"
          min="1"
          value={numWindows}
          onChange={(e) => setNumWindows(parseInt(e.target.value) || 1)}
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="delaySeconds"
          style={{ display: "block", marginBottom: "5px" }}
        >
          Delay Between Windows (seconds):
        </label>
        <input
          id="delaySeconds"
          type="number"
          min="0"
          step="0.1"
          value={delaySeconds}
          onChange={(e) =>
            setDelaySeconds(parseFloat(e.target.value) || 0)
          }
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

      <button
        onClick={handleLaunch}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "15px",
        }}
      >
        Launch Windows
      </button>

      {status && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f8f9fa",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        >
          <strong>Status:</strong> {status}
        </div>
      )}

      {countdown && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#e7f3ff",
            borderRadius: "4px",
          }}
        >
          <strong>Countdown:</strong> {countdown}
        </div>
      )}
    </div>
  );
}

export default App;

