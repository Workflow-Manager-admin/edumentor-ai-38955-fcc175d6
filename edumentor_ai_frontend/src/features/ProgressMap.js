import React from "react";

/**
 * PUBLIC_INTERFACE
 * Progress Map & Skill Tree View - fully client-side visual map.
 */
export function ProgressMap() {
  // Simple static tree for demo; in real use, data would be dynamic.
  const skills = [
    { id: 1, label: "Math", children: [{ id: 3, label: "Algebra" }, { id: 4, label: "Geometry" }] },
    { id: 2, label: "Science", children: [{ id: 5, label: "Biology" }, { id: 6, label: "Physics" }] }
  ];

  return (
    <div className="card" style={{ maxWidth: 570 }}>
      <h2 className="card-title">Progress Map & Skill Tree</h2>
      <div style={{ marginBottom: 8, color: "var(--muted)" }}>
        Visualize your subject progress. <b>Demo only.</b>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
        <div style={{ borderLeft: "2.5px solid var(--primary)", paddingLeft: 18 }}>
          {skills.map((skill) => (
            <div key={skill.id} style={{ marginBottom: 16 }}>
              <div style={{
                fontWeight: 700, color: "var(--primary)", fontSize: "1.2em"
              }}>
                {skill.label}
              </div>
              <ul style={{ margin: "9px 0 0 16px", padding: 0, listStyle: "none" }}>
                {skill.children.map((child) => (
                  <li key={child.id}
                    style={{ marginBottom: 6, fontWeight: 500, color: "var(--accent)" }}>
                    <span style={{ marginRight: 4, fontSize: "1.05em" }}>⬩</span>
                    {child.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div style={{ color: "var(--muted)", marginTop: 9, fontSize: "0.96em" }}>
        Track mastery in different areas as you complete tasks.
      </div>
    </div>
  );
}
