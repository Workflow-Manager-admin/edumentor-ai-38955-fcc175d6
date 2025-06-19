import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Interaction panel for messaging with mentor/AI.
 */
export function MentorInteraction() {
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
    <div className="card" style={{ maxWidth: 500 }}>
      <h2 className="card-title">Message Your Mentor</h2>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 7, alignItems: "flex-end" }}>
        <textarea
          rows={2}
          value={msg}
          placeholder="Ask for help, send an update, or request feedback..."
          onChange={(e) => setMsg(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn">
          Send
        </button>
      </form>
      {sent && (
        <div style={{ color: "var(--accent)", marginTop: 8 }}>
          Message sent!
        </div>
      )}
    </div>
  );
}
