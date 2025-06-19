import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Manual/interactive study planner (alternative to AI goal breakdown).
 */
export function ManualStudyPlanner() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    if (input.trim()) {
      setTasks((curr) => [...curr, { text: input, done: false }]);
      setInput("");
    }
  }
  function toggleDone(idx) {
    setTasks((curr) =>
      curr.map((t, i) => (i === idx ? { ...t, done: !t.done } : t))
    );
  }

  return (
    <div className="card" style={{ maxWidth: 410 }}>
      <h2 className="card-title">
        Study Planner <span style={{ fontSize: "0.93em", color: "#ED8510", fontWeight: 400 }}>Manual, Not AI</span>
      </h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 9 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Plan a step: e.g. 'Read Ch 4', 'Practice problems'"
          style={{ width: "82%" }}
        />
        <button className="btn btn-outline" type="submit" style={{ marginLeft: 6 }}>Add</button>
      </form>
      <ul style={{ paddingLeft: 0, listStyle: "none" }}>
        {tasks.map((t, i) => (
          <li key={i}
              style={{ marginBottom: 5, textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--muted)" : "var(--text)" }}>
            <input type="checkbox" checked={t.done} onChange={() => toggleDone(i)} style={{ marginRight: 6 }} />
            {t.text}
          </li>
        ))}
      </ul>
      {tasks.length === 0 && <div style={{ color: "var(--muted)" }}>No steps yet. Add your study steps!</div>}
    </div>
  );
}
