import React from "react";

/**
 * PUBLIC_INTERFACE
 * Analytics summary for goals (mocked, illustrated UI only).
 */
export function AnalyticsReports() {
  // Demo stats
  const stats = {
    goalsCompleted: 4,
    avgCompletionRate: 88,
    streak: 6,
    remindersSet: 2
  };
  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <h2 className="card-title">Analytics & Insights</h2>
      <div style={{ display: "flex", gap: 22, marginTop: 18, marginBottom: 22 }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ color: "var(--primary)", fontSize: "2.2em", fontWeight: 700 }}>{stats.goalsCompleted}</div>
          <div style={{ color: "var(--muted)" }}>Goals Completed</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ color: "var(--accent)", fontSize: "2.1em", fontWeight: 700 }}>
            {stats.avgCompletionRate}%
          </div>
          <div style={{ color: "var(--muted)" }}>Avg. Completion Rate</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ color: "var(--secondary)", fontSize: "2.1em", fontWeight: 700 }}>
            {stats.streak}
          </div>
          <div style={{ color: "var(--muted)" }}>Day Streak</div>
        </div>
      </div>
      <div style={{ color: "var(--text)", marginTop: 14 }}>
        <span>
          <strong>{stats.remindersSet}</strong> reminders set.
        </span>
      </div>
      <div style={{ marginTop: 12, color: "var(--muted)", fontSize: "0.95em" }}>
        Keep using EduMentor to raise your learning results!
      </div>
    </div>
  );
}
