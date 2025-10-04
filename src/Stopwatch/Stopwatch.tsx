import React, { useState } from "react";
import { useStopwatch } from "react-timer-hook";

export default function Stopwatch() {
  const { seconds, minutes, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });

  const [sessions, setSessions] = useState([]); // store past times (ms)

  const handleFinish = async () => {
    const totalMs = (minutes * 60 + seconds) * 1000;

    // save locally
    setSessions((s) => [...s, { ms: totalMs, at: Date.now() }]);

    // optional: send to backend
    // await fetch("/api/save", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ durationMs: totalMs }),
    // });

    reset(undefined, false); // then reset and keep it paused
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="font-mono text-5xl text-orange-600 tabular-nums">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>

      <div className="flex gap-2">
        <button className="px-3 py-1 rounded bg-neutral-800" onClick={isRunning ? pause : start}>
          {isRunning ? "Pause" : "Bake"}
        </button>
        <button className="px-3 py-1 rounded bg-neutral-800" onClick={handleFinish}>
          Finish Baking
        </button>
      </div>

      {/* tiny readout of saved sessions */}
      {sessions.length > 0 && (
        <ul className="mt-2 text-sm text-neutral-300">
          {sessions.map((s, i) => {
            const totalSec = Math.round(s.ms / 1000);
            const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
            const ss = String(totalSec % 60).padStart(2, "0");
            return <li key={i}>{mm}:{ss} @ {new Date(s.at).toLocaleTimeString()}</li>;
          })}
        </ul>
      )}
    </div>
  );
}
