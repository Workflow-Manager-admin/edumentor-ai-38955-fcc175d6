import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Mentor selection widget: choose AI or available mentor.
 */
export function MentorSelection() {
  const [selected, setSelected] = useState("ai"); // "ai" or "human"
  const mentors = [
    { id: "ai", name: "AI Mentor", subtitle: "Instant, always available", isAI: true },
    { id: "emma", name: "Emma Liu", subtitle: "Math & Science", isAI: false },
    { id: "jamal", name: "Jamal Khan", subtitle: "English & Humanities", isAI: false }
  ];

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <h2 className="card-title">Select Your Mentor</h2>
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {mentors.map((m) => (
          <li
            key={m.id}
            style={{
              marginBottom: 7,
              border: "1px solid var(--border)",
              borderRadius: 7,
              background: selected === m.id ? "rgba(80,227,194,0.11)" : "#FCFCFC",
              transition: "background 0.15s, border 0.15s"
            }}
          >
            <button
              className="btn"
              type="button"
              onClick={() => setSelected(m.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                background: "none",
                border: "none",
                color: "var(--text)",
                fontWeight: 500,
                boxShadow: "none",
                fontSize: "1em",
                padding: "13px 7px"
              }}
              aria-current={selected === m.id}
            >
              <span
                style={{
                  background: m.isAI ? "var(--primary)" : "var(--secondary)",
                  borderRadius: "50%",
                  color: "#fff",
                  width: 35,
                  height: 35,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  marginRight: 13
                }}
              >
                {m.isAI ? "AI" : m.name[0]}
              </span>
              <span>
                {m.name}
                <span
                  style={{
                    fontSize: "0.93em",
                    marginLeft: 6,
                    color: "var(--muted)"
                  }}
                >
                  {m.subtitle}
                </span>
              </span>
              {selected === m.id && (
                <span style={{ color: "var(--accent)", marginLeft: "auto", fontWeight: 700 }}>
                  ✓
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
