import React from "react";

/**
 * PUBLIC_INTERFACE
 * Progress tracking dashboard: shows weekly bar chart (mocked data).
 */
export function ProgressTracking() {
  // Example data for last 7 days (fraction/percentage of goals completed per day)
  const data = [
    { day: "Mon", percent: 0.7 },
    { day: "Tue", percent: 1 },
    { day: "Wed", percent: 0.6 },
    { day: "Thu", percent: 0.85 },
    { day: "Fri", percent: 1 },
    { day: "Sat", percent: 0.33 },
    { day: "Sun", percent: 0.9 }
  ];

  return (
    <div className="card" style={{ maxWidth: 590 }}>
      <h2 className="card-title">Your Progress This Week</h2>
      <div style={{ height: 160, display: "flex", alignItems: "end", gap: 22, marginBottom: 17, marginTop: 7 }}>
        {data.map((entry, i) => (
          <div key={entry.day} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: 28,
                height: Math.round(108 * entry.percent),
                background: entry.percent > 0.9 ? "var(--accent)" : "var(--primary)",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                marginBottom: 5,
                transition: "height 0.34s"
              }}
              title={`${Math.round(entry.percent * 100)}% of goals met`}
            />
            <span style={{ fontSize: "0.98em", color: "var(--muted)" }}>{entry.day}</span>
          </div>
        ))}
      </div>
      <div style={{ color: "var(--primary)", fontWeight: 600, marginBottom: 8 }}>
        {Math.round(
          100 *
            (data.reduce((s, d) => s + d.percent, 0) / data.length)
        )}
        % avg. goal completion
      </div>
      <div style={{ color: "var(--muted)", fontSize: "0.97em" }}>
        Keep up the great work!
      </div>
    </div>
  );
}
