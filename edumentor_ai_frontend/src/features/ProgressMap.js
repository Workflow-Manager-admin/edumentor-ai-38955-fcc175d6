import React, { useContext } from "react";
import { SyllabusContext } from "./SyllabusContext";

/**
 * PUBLIC_INTERFACE
 * Progress Map & Skill Tree View - dynamically rendered from syllabus state.
 */
export function ProgressMap() {
  const { syllabus, updateProgress } = useContext(SyllabusContext);

  // Recursive rendering for arbitrary depth skill tree (topics/subtopics)
  function renderTree(items, depth = 0) {
    return (
      <ul style={{ margin: depth === 0 ? "9px 0 0 0" : "5px 0 0 17px", padding: 0, listStyle: "none" }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 7, fontWeight: depth === 0 ? 700 : 500, color: item.completed ? "var(--accent)" : depth === 0 ? "var(--primary)" : "var(--text)" }}>
            <label style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={!!item.completed}
                style={{ marginRight: 7 }}
                onChange={() => updateProgress(item.id)}
                aria-label={`Mark ${item.label} as completed`}
              />
              <span>{item.label}</span>
            </label>
            {Array.isArray(item.children) && item.children.length > 0 && renderTree(item.children, depth + 1)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 570 }}>
      <h2 className="card-title">Progress Map & Skill Tree</h2>
      <div style={{ marginBottom: 8, color: "var(--muted)" }}>
        Visualize & update your real syllabus mastery here.
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
        <div style={{ borderLeft: "2.5px solid var(--primary)", paddingLeft: 18, width: "100%" }}>
          {syllabus.length === 0 && (
            <div style={{ color: "var(--muted)" }}>No syllabus uploaded. Please import your syllabus to get started.</div>
          )}
          {syllabus.length > 0 && renderTree(syllabus)}
        </div>
      </div>
      <div style={{ color: "var(--muted)", marginTop: 9, fontSize: "0.96em" }}>
        Tick a topic or subtopic when completed. Changes update across all progress modules!
      </div>
    </div>
  );
}
