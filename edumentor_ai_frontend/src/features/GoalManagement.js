import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * List and manage existing goals.
 */
export function GoalManagement() {
  // Example seed goals (in production, fetch from API/backend)
  const [goals, setGoals] = useState([
    {
      id: 1,
      text: "Read 5 chapters of Biology by Friday",
      status: "in_progress"
    },
    {
      id: 2,
      text: "Write English essay draft",
      status: "completed"
    },
    {
      id: 3,
      text: "Finish Mathematics homework",
      status: "in_progress"
    }
  ]);

  const toggleGoal = (id) => {
    setGoals((curr) =>
      curr.map((g) =>
        g.id === id
          ? {
              ...g,
              status: g.status === "completed" ? "in_progress" : "completed"
            }
          : g
      )
    );
  };

  const removeGoal = (id) =>
    setGoals((curr) => curr.filter((g) => g.id !== id));

  return (
    <div className="card" style={{ maxWidth: 620 }}>
      <h2 className="card-title">Your Goals</h2>
      {goals.length === 0 && (
        <div style={{ color: "var(--muted)", margin: "18px 0" }}>
          No goals yet.
        </div>
      )}
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {goals.map((goal) => (
          <li
            key={goal.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "9px 0",
              borderBottom: "1px solid var(--border)"
            }}
          >
            <span
              style={{
                textDecoration:
                  goal.status === "completed" ? "line-through" : "none",
                color:
                  goal.status === "completed" ? "#50E3C2" : "var(--text)",
                fontWeight: 500
              }}
            >
              {goal.text}
            </span>
            <span>
              <button
                className={
                  "btn btn-outline" +
                  (goal.status === "completed" ? " btn-outline-accent" : "")
                }
                style={{ marginRight: 8, fontSize: "0.97em", padding: "5px 11px" }}
                onClick={() => toggleGoal(goal.id)}
              >
                {goal.status === "completed" ? "Mark In Progress" : "Mark Done"}
              </button>
              <button
                className="btn btn-outline"
                style={{
                  borderColor: "var(--border)",
                  color: "#FF3742",
                  padding: "4px 8px"
                }}
                onClick={() => removeGoal(goal.id)}
              >
                Remove
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
