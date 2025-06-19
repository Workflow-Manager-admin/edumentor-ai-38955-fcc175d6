import React from "react";

/**
 * PUBLIC_INTERFACE
 * Community Challenges/Leaderboard → Local/demo fake leaderboard (no backend).
 */
export function LocalLeaderboard() {
  // Demo: static leaderboard
  const users = [
    { name: "Alex", points: 77 },
    { name: "Jamie", points: 68 },
    { name: "Sundar", points: 65 },
    { name: "May", points: 53 }
  ];

  return (
    <div className="card" style={{ maxWidth: 340 }}>
      <h2 className="card-title">
        Leaderboard <span style={{ fontSize: "0.91em", color: "#ED8510" }}>Local Only</span>
      </h2>
      <ol style={{ margin: "12px 0", paddingLeft: 20 }}>
        {users.map((u, i) => (
          <li key={i} style={{ fontWeight: 600, color: i === 0 ? "var(--primary)" : "var(--text)", marginBottom: 6 }}>
            <span style={{ fontWeight: 700 }}>{u.name}</span> — {u.points} pts
            {i === 0 && <span style={{ marginLeft: 7, color: "var(--accent)" }}>🏆</span>}
          </li>
        ))}
      </ol>
      <div style={{ color: "var(--muted)", fontSize: "0.91em" }}>
        Community challenges available in full version.
      </div>
    </div>
  );
}
