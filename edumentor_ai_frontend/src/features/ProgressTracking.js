import React, { useContext, useMemo } from "react";
import { SyllabusContext } from "./SyllabusContext";

/**
 * PUBLIC_INTERFACE
 * Progress tracking dashboard: synced to real syllabus progress.
 */
export function ProgressTracking() {
  const { syllabus } = useContext(SyllabusContext);

  // Helper to sum topic/subtopic completion
  function flattenSyllabus(items) {
    let arr = [];
    for (const t of items) {
      arr.push(t);
      if (Array.isArray(t.children) && t.children.length > 0) {
        arr = arr.concat(flattenSyllabus(t.children));
      }
    }
    return arr;
  }

  const allTopics = useMemo(() => flattenSyllabus(syllabus), [syllabus]);
  const totalTopics = allTopics.length;
  const completedCount = allTopics.filter((t) => t.completed).length;
  // Demo: Show now/snapshot as current week's % (could be made more granular with timestamps)
  const percent = totalTopics === 0 ? 0 : completedCount / totalTopics;

  // Simulating a week by splitting evenly so chart demo is visually rich
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const progressPerDay = Array(7).fill(percent);

  return (
    <div className="card" style={{ maxWidth: 590 }}>
      <h2 className="card-title">Your Progress This Week</h2>
      <div style={{ color: "var(--muted)", fontSize: "0.97em", marginBottom: 7 }}>
        Progress data reflects your syllabus completion.
      </div>
      <div style={{ height: 160, display: "flex", alignItems: "end", gap: 22, marginBottom: 17, marginTop: 7 }}>
        {daysOfWeek.map((day, i) => (
          <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: 28,
                height: Math.round(108 * progressPerDay[i]),
                background: progressPerDay[i] > 0.9 ? "var(--accent)" : "var(--primary)",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                marginBottom: 5,
                transition: "height 0.34s"
              }}
              title={`${Math.round(progressPerDay[i] * 100)}% of syllabus/topics completed`}
            />
            <span style={{ fontSize: "0.98em", color: "var(--muted)" }}>{day}</span>
          </div>
        ))}
      </div>
      <div style={{ color: "var(--primary)", fontWeight: 600, marginBottom: 8 }}>
        {Math.round(percent * 100)}% of all topics completed
      </div>
      <div style={{ color: "var(--muted)", fontSize: "0.97em" }}>
        {completedCount} / {totalTopics} completed. Keep up the great work!
      </div>
    </div>
  );
}
