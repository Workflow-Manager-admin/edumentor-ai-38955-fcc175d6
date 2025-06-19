import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Form for adding daily/weekly progress updates.
 */
export function ProgressUpdates() {
  const [update, setUpdate] = useState("");
  const [confirm, setConfirm] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (update.trim()) {
      setUpdate("");
      setConfirm(true);
      setTimeout(() => setConfirm(false), 1200);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 440 }}>
      <h2 className="card-title">Update Your Progress</h2>
      <form onSubmit={handleUpdate}>
        <textarea
          rows={3}
          value={update}
          onChange={(e) => setUpdate(e.target.value)}
          placeholder="Summarize your daily or weekly progress..."
        />
        <button type="submit" className="btn" style={{ marginTop: 6 }}>
          Add Update
        </button>
      </form>
      {confirm && (
        <div style={{ color: "var(--secondary)", marginTop: 8 }}>
          Progress update added!
        </div>
      )}
    </div>
  );
}
