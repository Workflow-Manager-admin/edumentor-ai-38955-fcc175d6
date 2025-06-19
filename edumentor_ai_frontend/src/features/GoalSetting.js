import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Goal setting form for users to add new academic goals.
 */
export function GoalSetting() {
  // Local state for new goal input
  const [goal, setGoal] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSetGoal = (e) => {
    e.preventDefault();
    if (goal.trim()) {
      // For demo, just reset input and show confirmation
      setGoal("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1700);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <h2 className="card-title">Set a New Academic Goal</h2>
      <form onSubmit={handleSetGoal}>
        <label htmlFor="goal">Goal description</label>
        <input
          id="goal"
          name="goal"
          value={goal}
          placeholder="e.g. Complete Math assignment by Sunday"
          onChange={(e) => setGoal(e.target.value)}
          required
        />
        <button type="submit" className="btn" style={{ marginTop: 7 }}>
          Add Goal
        </button>
      </form>
      {success && (
        <div style={{ color: "#50E3C2", marginTop: 10, fontWeight: 500 }}>
          Goal added!
        </div>
      )}
    </div>
  );
}
