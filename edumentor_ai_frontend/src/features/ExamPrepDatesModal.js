import React, { useState, useEffect } from "react";
import { useExam } from "./ExamContext";

// Key for browser storage
const DATES_STORAGE_KEY = "_edumentor_exam_dates_v1";

/**
 * PUBLIC_INTERFACE
 * Prompt/modal shown after exam selection, blocks entire UI until both dates are captured.
 * Stores preparation start and exam date in localStorage and context.
 */
export default function ExamPrepDatesModal({ onSave }) {
  const { exam } = useExam();
  const [startDate, setStartDate] = useState("");
  const [examDate, setExamDate] = useState("");
  const [error, setError] = useState("");

  // Load previously saved dates if available
  useEffect(() => {
    try {
      const d = window.localStorage.getItem(DATES_STORAGE_KEY);
      if (d) {
        const { startDate, examDate } = JSON.parse(d);
        if (startDate) setStartDate(startDate);
        if (examDate) setExamDate(examDate);
      }
    } catch {}
  }, []);

  const validateDates = (start, exam) => {
    if (!start || !exam) return false;
    if (new Date(start) > new Date(exam)) return false;
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !examDate) {
      setError("Please enter both dates to continue.");
      return;
    }
    if (!validateDates(startDate, examDate)) {
      setError("Start date must not be after exam date.");
      return;
    }
    // Save to localStorage
    window.localStorage.setItem(
      DATES_STORAGE_KEY,
      JSON.stringify({ startDate, examDate, exam })
    );
    // Send to parent for context/global state
    if (onSave) onSave({ startDate, examDate });
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(26,26,60,0.89)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          maxWidth: "90vw",
          padding: "30px 22px 25px 22px",
          boxShadow: "0 2px 32px 0 rgba(74,144,226,0.09)",
        }}
      >
        <h2
          style={{
            color: "var(--primary)",
            fontSize: "1.45rem",
            textAlign: "center",
            margin: "0 0 .7em 0",
          }}
        >
          Enter Preparation Dates
        </h2>
        <div style={{ color: "var(--muted)", fontWeight: 500, marginBottom: 18, textAlign: "center" }}>
          Please enter your preparation start date and <b>exam date</b> for <span style={{ color: "var(--primary)" }}>{exam}</span>. These are needed to generate a study plan.
        </div>
        <div style={{ marginBottom: 13 }}>
          <label style={{ fontWeight: 600, display: "block" }} htmlFor="start-date">
            Preparation Start Date
          </label>
          <input
            type="date"
            id="start-date"
            min={new Date().toISOString().split("T")[0]}
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setError("");
            }}
            style={{ marginBottom: 13, fontSize: "1em", width: "100%" }}
            required
          />
          <label style={{ fontWeight: 600, display: "block" }} htmlFor="exam-date">
            Exam Date
          </label>
          <input
            type="date"
            id="exam-date"
            min={startDate || new Date().toISOString().split("T")[0]}
            value={examDate}
            onChange={(e) => {
              setExamDate(e.target.value);
              setError("");
            }}
            style={{ fontSize: "1em", width: "100%" }}
            required
          />
        </div>
        {error && (
          <div style={{ color: "#ff3742", fontWeight: 500, marginBottom: 10 }}>{error}</div>
        )}
        <button
          type="submit"
          className="btn btn-large"
          style={{
            width: "100%",
            marginTop: 7,
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            fontSize: "1.09em",
          }}
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}

// PUBLIC_INTERFACE
// Retrieve dates from browser storage (utility for consumers outside React)
export function getExamPrepDatesFromStorage() {
  try {
    const d = window.localStorage.getItem(DATES_STORAGE_KEY);
    return d ? JSON.parse(d) : null;
  } catch {
    return null;
  }
}
