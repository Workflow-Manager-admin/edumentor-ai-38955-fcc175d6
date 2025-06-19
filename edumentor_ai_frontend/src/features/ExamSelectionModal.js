import React, { useState, useEffect, useRef } from "react";
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
  // similar to loading, but triggers rerender if needed
  const [syllabusFetched, setSyllabusFetched] = useState(false);
  // Used to trigger retry fetch after error
  const retryFetch = useRef(null);

  // Effect: Whenever selection changes, begin fetch instantly (only if not currently loading)
  useEffect(() => {
    let isMounted = true;
    async function fetchSyllabusChoice(choice) {
      setError("");
      setLoading(true);
      setSyllabusFetched(false);

      // Begin fetch
      try {
        await fetchSyllabusFromWeb(choice); // Throws on error
        if (isMounted) {
          setExam(choice);
          setSyllabusFetched(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            "Failed to fetch syllabus for selected exam. " +
            (err?.message || "Please check your connection and try again.")
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // If selected changes and is not empty, start fetch
    if (selected) {
      fetchSyllabusChoice(selected);
      retryFetch.current = () => fetchSyllabusChoice(selected);
    }

    return () => {
      isMounted = false;
    };
    // Only run when selected changes
    // eslint-disable-next-line
  }, [selected, setExam]);

  // Retry handler (in case of error)
  const handleRetry = () => {
    if (retryFetch.current && selected) {
      retryFetch.current();
    }
  };

  // Block flow until syllabus is successfully loaded (setExam triggers modal close via context)
  // UI disables all inputs while loading

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
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading && selected !== option.value ? 0.7 : 1
              }}
            >
              <input
                type="radio"
                name="exam"
                value={option.value}
                checked={selected === option.value}
                onChange={() => {
                  if (!loading) {
                    setSelected(option.value);
                    setError("");
                  }
                }}
                style={{ marginRight: 8 }}
                disabled={loading}
              />
              {option.label}
              {loading && selected === option.value && (
                <span
                  style={{
                    marginLeft: 7,
                    color: "var(--secondary)",
                    fontSize: "0.98em"
                  }}
                  aria-live="polite"
                >
                  &nbsp;Loading...
                </span>
              )}
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
        {error && (
          <div style={{ color: "var(--muted)", fontSize: "1em", marginTop: 7 }}>
            <button
              onClick={handleRetry}
              className="btn btn-large"
              disabled={loading}
              style={{
                marginTop: 2,
                width: "100%",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: 5,
                fontSize: "1.09em"
              }}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
