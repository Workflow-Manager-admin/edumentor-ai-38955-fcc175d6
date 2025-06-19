import React from "react";

/**
 * PUBLIC_INTERFACE
 * Personalized Coach (AI) → Rules-based encouragement panel (DEMO).
 */
export function RulesBasedCoach() {
  const advice = [
    "Take a short break if you feel tired.",
    "Remember to review your notes each session.",
    "Set small, achievable milestones.",
    "Celebrate your progress, no matter how small!",
    "Stay hydrated and don't skip meals."
  ];

  return (
    <div className="card" style={{ maxWidth: 390 }}>
      <h2 className="card-title">
        Coach Panel <span style={{ fontSize: "0.86em", color: "#ED8510", fontWeight: 400 }}>Simulated, Not AI</span>
      </h2>
      <div style={{ marginBottom: 10, color: "var(--muted)" }}>
        Rules-based motivational tips (Demo for offline use).
      </div>
      <ul style={{ listStyle: "disc", margin: 0, paddingLeft: 28 }}>
        {advice.map((t, i) => (
          <li key={i} style={{ marginBottom: 6, color: "var(--primary)", fontWeight: 500 }}>
            {t}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 10, color: "var(--text)", fontSize: "0.97em" }}>
        No AI/feedback data required.
      </div>
    </div>
  );
}
