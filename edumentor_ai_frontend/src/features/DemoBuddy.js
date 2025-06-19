import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Study Buddy Matchmaking → Demo buddy/notes and simulated chat (no backend/AI).
 */
export function DemoBuddy() {
  const [messages, setMessages] = useState([
    { from: "buddy", text: "Hi! I'm your demo study buddy. Share your notes or questions here!" }
  ]);
  const [input, setInput] = useState("");

  function sendMsg(e) {
    e.preventDefault();
    if (input.trim()) {
      setMessages((msgs) => [
        ...msgs,
        { from: "you", text: input },
        { from: "buddy", text: "That's awesome! Let me know if you want to review together. (Simulated)" }
      ]);
      setInput("");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 430 }}>
      <h2 className="card-title">
        Study Buddy <span style={{ fontSize: "0.9em", color: "#ED8510" }}>DEMO</span>
      </h2>
      <div style={{
        background: "#f8fafc",
        borderRadius: 8,
        minHeight: 75,
        maxHeight: 150,
        padding: 10,
        marginBottom: 10,
        overflowY: "auto"
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 6,
              color: msg.from === "you" ? "var(--primary)" : "var(--muted)",
              textAlign: msg.from === "you" ? "right" : "left",
              fontWeight: msg.from === "you" ? 600 : 400
            }}>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMsg} style={{ display: "flex", gap: 7 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a note to your buddy"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-outline">
          Send
        </button>
      </form>
      <div style={{ color: "var(--muted)", marginTop: 7, fontSize: "0.95em" }}>
        Demo only: No backend/AI, buddy messages are canned responses.
      </div>
    </div>
  );
}
