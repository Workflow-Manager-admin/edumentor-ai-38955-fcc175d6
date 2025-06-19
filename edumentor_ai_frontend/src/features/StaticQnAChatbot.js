import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * GPT-4 Q&A Helper → FAQ/static Q&A/canned chatbot.
 */
export function StaticQnAChatbot() {
  // Canned FAQ Q&A
  const [input, setInput] = useState("");
  const [thread, setThread] = useState([
    { from: "faq", text: "Hi! Ask a question or choose a topic below." }
  ]);
  const faqs = [
    { q: "How do I set a goal?", a: "Go to the Goals tab and use the form to add a new goal description." },
    { q: "What is Focus Mode?", a: "Use Focus Mode to timebox your sessions and track your streaks. It's based on the Pomodoro technique." },
    { q: "How is data stored?", a: "All data is local to your browser. There’s no cloud storage in demo/offline mode." }
  ];

  function sendQuestion(e) {
    e.preventDefault();
    const found = faqs.find((f) =>
      f.q.toLowerCase().includes(input.trim().toLowerCase())
    );
    setThread((curr) => [
      ...curr,
      { from: "you", text: input },
      {
        from: "faq",
        text: found
          ? found.a
          : "Sorry, this is a demo and I can only answer preset questions. Try topics like 'goal', 'focus', or 'data'."
      }
    ]);
    setInput("");
  }

  function askPreset(faq) {
    setThread((curr) => [
      ...curr,
      { from: "you", text: faq.q },
      { from: "faq", text: faq.a }
    ]);
  }

  return (
    <div className="card" style={{ maxWidth: 450 }}>
      <h2 className="card-title">
        Q&A Chatbot <span style={{ fontSize: "0.88em", color: "#ED8510" }}>Static/Demo</span>
      </h2>
      <div style={{
        background: "#F6F8FB",
        borderRadius: 8,
        padding: 10,
        minHeight: 88,
        maxHeight: 150,
        overflowY: "auto",
        marginBottom: 8
      }}>
        {thread.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 6,
              color: m.from === "faq" ? "var(--muted)" : "var(--primary)",
              textAlign: m.from === "you" ? "right" : "left"
            }}>
            <b>{m.from === "you" ? "You: " : "Bot: "}</b>{m.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendQuestion} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question…"
          style={{ flex: 1 }}
        />
        <button className="btn btn-outline" type="submit" disabled={!input.trim()}>
          Ask
        </button>
      </form>
      <div style={{ fontWeight: 500, fontSize: "0.97em", marginBottom: 4 }}>
        Quick Topics:
      </div>
      <div>
        {faqs.map((faq, i) => (
          <button
            type="button"
            key={i}
            className="btn btn-outline"
            style={{ marginRight: 7, marginBottom: 7, fontSize: "0.93em" }}
            onClick={() => askPreset(faq)}
          >
            {faq.q}
          </button>
        ))}
      </div>
      <div style={{ color: "var(--muted)", marginTop: 7, fontSize: "0.96em" }}>
        Demo only: No real AI response, just pre-written answers.
      </div>
    </div>
  );
}
