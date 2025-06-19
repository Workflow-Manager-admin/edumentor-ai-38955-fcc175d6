import React, { useState } from "react";
import { useExam } from "./ExamContext";
import { fetchSyllabusFromWeb } from "./SyllabusContext";

// Only offer NEET and JEE as exam options.
const EXAMS = [
  { value: "NEET", label: "NEET" },
  { value: "JEE", label: "JEE" }
];

/**
 * PUBLIC_INTERFACE
 * Modal to prompt for entrance exam selection; blocks until selection & official syllabus is fetched.
 */
export default function ExamSelectionModal() {
  const { setExam } = useExam();
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [syllabusFetched, setSyllabusFetched] = useState(false);

  // Triggers auto-fetch when user chooses NEET/JEE (as soon as selection is made and "Continue" is pressed)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) {
      setError("Please select an exam to continue");
      return;
    }
    setError("");
    setLoading(true);
    setSyllabusFetched(false);
    try {
      // Wait for syllabus fetch to finish (needed for blocking)
      await fetchSyllabusFromWeb(selected); // will throw on error
      setExam(selected); // only set exam after successful fetch
      setSyllabusFetched(true);
    } catch (err) {
      setError(
        "Failed to fetch syllabus for selected exam. " +
        (err?.message || "Please check your connection and try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  // Block flow until syllabus is successfully loaded (now handled by above logic)
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(26,26,60,0.93)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 11,
          minWidth: 320,
          maxWidth: "92vw",
          padding: "34px 24px 28px 24px",
          boxShadow: "0 2px 32px 0 rgba(74,144,226,0.10)"
        }}
      >
        <h2
          style={{
            margin: "0 0 10px 0",
            color: "var(--primary)",
            fontSize: "2rem",
            textAlign: "center"
          }}
        >
          Welcome to EduMentor AI
        </h2>
        <div
          style={{
            color: "var(--muted)",
            marginBottom: 22,
            fontWeight: 500,
            textAlign: "center"
          }}
        >
          Please select the entrance exam you are preparing for.
        </div>
        <div style={{ marginBottom: 15, display: "flex", flexDirection: "column", gap: 10 }}>
          {EXAMS.map((option) => (
            <label
              key={option.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontWeight: 500,
                fontSize: "1.1rem",
                color: "#333F53",
                cursor: "pointer"
              }}
            >
              <input
                type="radio"
                name="exam"
                value={option.value}
                checked={selected === option.value}
                onChange={() => {
                  setSelected(option.value);
                  setError("");
                }}
                style={{ marginRight: 8 }}
                disabled={loading}
              />
              {option.label}
            </label>
          ))}
        </div>
        {error && (
          <div style={{ color: "#ff3742", fontWeight: 500, marginBottom: 10 }}>
            {error}
          </div>
        )}
        {loading && (
          <div style={{ color: "var(--secondary)", fontWeight: 500, marginBottom: 10 }}>
            Fetching official syllabus for {selected}... Please wait.
          </div>
        )}
        <button
          type="submit"
          className="btn btn-large"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 7,
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            fontSize: "1.1em"
          }}
        >
          {loading ? "Fetching Syllabus..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
