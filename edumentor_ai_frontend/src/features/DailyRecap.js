import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Smart Daily Recap (client-side, user-generated or auto).
 */
export function DailyRecap() {
  const [recap, setRecap] = useState("");
  const [entries, setEntries] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    if (recap.trim()) {
      setEntries((curr) => [
        ...curr,
        { text: recap, time: new Date() }
      ]);
      setRecap("");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 460 }}>
      <h2 className="card-title">
        Daily Recap <span style={{ fontSize: "0.9em", color: "var(--muted)" }}>Manual Entry</span>
      </h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 14 }}>
        <textarea
          rows={3}
          value={recap}
          onChange={(e) => setRecap(e.target.value)}
          placeholder="Summarize your day’s learning and key moments…"
          style={{ width: "100%" }}
        />
        <button className="btn" type="submit" style={{ marginTop: 8 }}>
          Add Recap
        </button>
      </form>
      {entries.length > 0 && (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 3 }}>
            Recaps:
          </div>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            {entries.slice(-5).reverse().map((item, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                <span>{item.text}</span>
                <span style={{ color: "var(--muted)", marginLeft: 6, fontSize: "0.91em" }}>
                  {item.time.toLocaleDateString([], { month: "short", day: "numeric" })} {item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {entries.length === 0 && <div style={{ color: "var(--muted)" }}>No recaps yet.</div>}
    </div>
  );
}
