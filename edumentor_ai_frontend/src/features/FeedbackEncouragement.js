import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Mentor/AI feedback feature demo.
 */
export function FeedbackEncouragement() {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (msg.trim()) {
      setMsg("");
      setSent(true);
      setTimeout(() => setSent(false), 1100);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 440 }}>
      <h2 className="card-title">Provide Feedback & Encouragement</h2>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 7 }}>
        <input
          type="text"
          value={msg}
          placeholder="Great work! Keep going..."
          onChange={(e) => setMsg(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn">
          Encourage
        </button>
      </form>
      {sent && (
        <div style={{ color: "var(--secondary)", marginTop: 10, fontWeight: 600 }}>
          Feedback sent!
        </div>
      )}
    </div>
  );
}
