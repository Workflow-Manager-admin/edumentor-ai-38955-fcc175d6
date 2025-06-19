import React, { useState, useContext } from "react";
import { useExam } from "./ExamContext";
import { SyllabusContext } from "./SyllabusContext";

// Only offer NEET and JEE as exam options.
const EXAMS = [
  { value: "NEET", label: "NEET" },
  { value: "JEE", label: "JEE" }
];

/**
 * PUBLIC_INTERFACE
 * Modal to prompt for entrance exam selection; blocks until selection.
 * When user selects NEET or JEE, loads the syllabus immediately from static bundle.
 */
export default function ExamSelectionModal() {
  const { setExam } = useExam();
  const { importSyllabusForExam } = useContext(SyllabusContext);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");

  function onExamChange(examVal) {
    setSelected(examVal);
    setError("");
    try {
      importSyllabusForExam(examVal); // synchronous: immediately sets syllabus in context
      setExam(examVal); // closes modal
    } catch (e) {
      setError("Failed to load bundled syllabus for selected exam.");
    }
  }

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
      <div
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
          Welcome to MapMyPrep
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
                cursor: "pointer",
                opacity: 1
              }}
            >
              <input
                type="radio"
                name="exam"
                value={option.value}
                checked={selected === option.value}
                onChange={() => onExamChange(option.value)}
                style={{ marginRight: 8 }}
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
      </div>
    </div>
  );
}
