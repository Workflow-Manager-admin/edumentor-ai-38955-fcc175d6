import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Motivational nudges & reminders list and send action (demo mode).
 */
export function MotivationalNudges() {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  // Demo motivational quotes
  const quotes = [
    "You're making progress—even small steps count!",
    "Believe in your ability to learn anything.",
    "Don't stop when you're tired. Stop when you're done.",
    "Keep going, future you will thank you!",
    "Small daily improvements lead to stunning results."
  ];

  const randomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

  const handleSendNudge = (e) => {
    e.preventDefault();
    setMsg(randomQuote());
    setSent(true);
    setTimeout(() => setSent(false), 1200);
  };

  return (
    <div className="card" style={{ maxWidth: 400 }}>
      <h2 className="card-title">Send Motivational Nudge</h2>
      <form onSubmit={handleSendNudge} style={{ marginBottom: 8 }}>
        <button type="submit" className="btn btn-accent">
          Send Random Nudge
        </button>
      </form>
      {sent && (
        <div style={{ color: "var(--accent)", marginTop: 10, fontWeight: 500 }}>
          Nudge sent: <span style={{ fontStyle: "italic" }}>{msg}</span>
        </div>
      )}
    </div>
  );
}
