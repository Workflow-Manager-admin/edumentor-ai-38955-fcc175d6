import React from "react";

/**
 * PUBLIC_INTERFACE
 * Career-Path Visualizer (static, demo).
 */
export function CareerVisualizer() {
  // Static sequence for demo only
  const path = [
    { step: "📘 High School", info: "Foundation" },
    { step: "🎓 College", info: "Major: Computer Science" },
    { step: "🧑‍💻 Internship", info: "Software Developer Intern" },
    { step: "💼 Job", info: "Junior Developer" }
  ];

  return (
    <div className="card" style={{ maxWidth: 470 }}>
      <h2 className="card-title">Career-Path Visualizer</h2>
      <div style={{ color: "var(--muted)", fontSize: "0.97em", marginBottom: 12 }}>
        See a demo educational & career journey.
      </div>
      <ol style={{ paddingLeft: 24 }}>
        {path.map((p, i) => (
          <li key={i} style={{ marginBottom: 15, fontWeight: 500 }}>
            <span style={{ fontSize: "1.21em", marginRight: 7 }}>{p.step}</span>
            <span style={{ color: "var(--primary)", marginLeft: 6 }}>{p.info}</span>
            {i < path.length - 1 && (
              <span style={{ marginLeft: 16, color: "var(--accent)" }}>→</span>
            )}
          </li>
        ))}
      </ol>
      <div style={{ color: "var(--muted)", marginTop: 8 }}>
        (For demo only – customize in full version)
      </div>
    </div>
  );
}
