import React, { createContext, useContext, useState, useEffect } from "react";

 // Must match modal's storage key
const DATES_STORAGE_KEY = "_mapmyprep_exam_dates_v1";

/**
 * PUBLIC_INTERFACE
 * ExamPrepDatesContext - provides exam preparation start and exam date (with setter).
 */
export const ExamPrepDatesContext = createContext();

/**
 * PUBLIC_INTERFACE
 * Provider that loads/persists exam preparation dates.
 */
export function ExamPrepDatesProvider({ children }) {
  const [dates, setDates] = useState(() => {
    try {
      const d = window.localStorage.getItem(DATES_STORAGE_KEY);
      return d ? JSON.parse(d) : { startDate: "", examDate: "" };
    } catch {
      return { startDate: "", examDate: "" };
    }
  });

  useEffect(() => {
    if (dates && dates.startDate && dates.examDate) {
      window.localStorage.setItem(DATES_STORAGE_KEY, JSON.stringify(dates));
    }
  }, [dates]);

  return (
    <ExamPrepDatesContext.Provider value={{ ...dates, setExamPrepDates: setDates }}>
      {children}
    </ExamPrepDatesContext.Provider>
  );
}

/**
 * PUBLIC_INTERFACE
 * Hook to access preparation dates (and their setter).
 */
export function useExamPrepDates() {
  return useContext(ExamPrepDatesContext);
}
