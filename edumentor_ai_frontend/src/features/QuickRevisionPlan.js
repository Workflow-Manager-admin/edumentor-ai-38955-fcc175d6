import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Emergency Boost Mode → Manual Quick Revision Plan (DEMO).
 */
export function QuickRevisionPlan() {
  const [steps, setSteps] = useState([]);
  const [input, setInput] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    if (input.trim()) {
      setSteps((curr) => [...curr, input]);
      setInput("");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 410 }}>
      <h2 className="card-title">
        Quick Revision Plan <span style={{ fontSize: "0.91em", color: "#ED8510" }}>Manual</span>
      </h2>
      <div style={{ color: "var(--muted)", fontSize: "0.97em", marginBottom: 7 }}>
        Create a rapid revision list when in need of a productivity boost.
      </div>
      <form onSubmit={handleAdd} style={{ marginBottom: 9 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Review formulas, Recap notes"
          style={{ width: "78%" }}
        />
        <button className="btn btn-outline" type="submit" style={{ marginLeft: 7 }}>
          Add
        </button>
      </form>
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {steps.map((s, i) => (
          <li key={i} style={{ color: "var(--accent)", marginBottom: 3 }}>
            {i + 1}. {s}
          </li>
        ))}
      </ul>
      {steps.length === 0 && <div style={{ color: "var(--muted)" }}>No steps yet. Add quick actions above!</div>}
    </div>
  );
}
