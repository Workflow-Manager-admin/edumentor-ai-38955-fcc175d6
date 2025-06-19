import React, { createContext, useContext, useState, useEffect } from "react";

// Key for browser storage
const STORAGE_KEY = "_edumentor_exam_v1";

/**
 * PUBLIC_INTERFACE
 * ExamContext holds the selected exam and a setter function.
 */
export const ExamContext = createContext();

/**
 * PUBLIC_INTERFACE
 * ExamProvider persists the selected exam and provides context.
 */
export function ExamProvider({ children }) {
  const [exam, setExam] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (exam) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(exam));
  }, [exam]);

  return (
    <ExamContext.Provider value={{ exam, setExam }}>
      {children}
    </ExamContext.Provider>
  );
}

/**
 * PUBLIC_INTERFACE
 * Hook to access the exam context.
 */
export function useExam() {
  return useContext(ExamContext);
}
