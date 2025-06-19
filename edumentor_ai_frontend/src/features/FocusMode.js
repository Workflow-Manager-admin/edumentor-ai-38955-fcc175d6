import React, { useState, useEffect, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * Focus Mode (Pomodoro/streaks/sounds/check-ins) - fully client-side.
 */
export function FocusMode() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [mode, setMode] = useState("focus"); // "focus" or "break"
  const [streak, setStreak] = useState(0);
  const audioRef = useRef();

  useEffect(() => {
    if (!isRunning) return;
    if (seconds === 0) {
      handleTimerComplete();
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [isRunning, seconds]);

  function handleTimerComplete() {
    if (mode === "focus") {
      setStreak((s) => s + 1);
      if (audioRef.current) audioRef.current.play();
      setMode("break");
      setSeconds(5 * 60);
    } else {
      if (audioRef.current) audioRef.current.play();
      setMode("focus");
      setSeconds(25 * 60);
    }
    setIsRunning(false);
  }

  function start() {
    setIsRunning(true);
  }
  function pause() {
    setIsRunning(false);
  }
  function reset() {
    setIsRunning(false);
    setSeconds(mode === "focus" ? 25 * 60 : 5 * 60);
  }

  function format(seconds) {
    const min = Math.floor(seconds / 60).toString().padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  }

  return (
    <div className="card" style={{ maxWidth: 410 }}>
      <h2 className="card-title">
        Focus Mode <span style={{ fontSize: "0.87em", color: "var(--muted)" }}>(Pomodoro)</span>
      </h2>
      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <span
          style={{
            fontSize: "3.2em",
            fontWeight: 800,
            color: mode === "focus" ? "var(--primary)" : "var(--accent)",
            letterSpacing: "2px"
          }}
        >
          {format(seconds)}
        </span>
      </div>
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <span
          style={{
            padding: "3px 12px",
            borderRadius: 5,
            fontSize: "0.99em",
            color: "#fff",
            background: mode === "focus" ? "var(--primary)" : "var(--accent)"
          }}
        >
          {mode === "focus" ? "Focus" : "Break"}
        </span>
        <span style={{ marginLeft: 16, color: "var(--muted)" }}>
          Streak: <b>{streak}</b>
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 18, justifyContent: "center" }}>
        {!isRunning && (
          <button className="btn" onClick={start}>
            {seconds === 0 ? "Restart" : "Start"}
          </button>
        )}
        {isRunning && (
          <button className="btn btn-outline" onClick={pause}>
            Pause
          </button>
        )}
        <button className="btn btn-outline" onClick={reset}>
          Reset
        </button>
      </div>
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/10/16/audio_12c4b0e7d6.mp3" />
      <div style={{ color: "var(--muted)", fontSize: "0.92em" }}>
        Timebox your studying using the Pomodoro technique. Earn streaks for each session!
      </div>
    </div>
  );
}
