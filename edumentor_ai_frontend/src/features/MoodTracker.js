import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Mood & Focus Tracker - instant log and visualization.
 */
export function MoodTracker() {
  const [mood, setMood] = useState("");
  const [log, setLog] = useState([]);
  const moods = [
    { key: "😃", label: "Happy" },
    { key: "😐", label: "Okay" },
    { key: "😟", label: "Stressed" },
    { key: "😴", label: "Tired" },
    { key: "💪", label: "Motivated" }
  ];

  function handleSetMood(k, l) {
    setMood(k);
    setLog((curr) => [...curr, { mood: l, icon: k, time: new Date() }]);
  }

  return (
    <div className="card" style={{ maxWidth: 400 }}>
      <h2 className="card-title">
        Mood & Focus Tracker
      </h2>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 500, color: "var(--muted)", marginBottom: 6 }}>
          How do you feel right now?
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 9 }}>
          {moods.map((m) => (
            <button
              key={m.key}
              className="btn"
              style={{
                fontSize: "1.3em",
                background: mood === m.key ? "var(--secondary)" : "",
                color: mood === m.key ? "#fff" : "",
                padding: "6px 13px"
              }}
              onClick={() => handleSetMood(m.key, m.label)}
              type="button"
            >
              {m.key}
            </button>
          ))}
        </div>
      </div>
      <div style={{ fontWeight: 500, marginBottom: 5 }}>
        Recent Mood Entries:
      </div>
      {log.length === 0 && <div style={{ color: "var(--muted)" }}>No entries yet.</div>}
      <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
        {log.slice(-5).reverse().map((entry, i) => (
          <li key={i} style={{ color: "var(--text)", marginBottom: 3 }}>
            <span style={{ marginRight: 8 }}>{entry.icon}</span>
            <span>{entry.mood}</span>
            <span style={{ float: "right", color: "var(--muted)", fontSize: "0.91em" }}>
              {entry.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
