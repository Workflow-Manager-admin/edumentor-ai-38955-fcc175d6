import React, { createContext, useState, useEffect, useCallback } from "react";

/**
 * PUBLIC_INTERFACE
 * Unified user progress context providing points, streaks, daily focus sessions, and recaps—persisted to localStorage.
 *
 * Data Structure:
 * {
 *   points: Number,          // total points ("coins")
 *   streak: Number,          // daily streak
 *   lastActive: string,      // ISO date string of last activity
 *   focusHistory: [          // Array of {date, seconds}
 *     { date: 'YYYY-MM-DD', seconds: 1500 }
 *   ],
 *   recaps: [                // Array of {text, time}
 *     { text: "...", time: Date string }
 *   ],
 *   syllabusStats: {         // Computed stats (filled by context consumer or passed via API)
 *     totalTopics: Number,
 *     completed: Number
 *   }
 * }
 */
export const UserProgressContext = createContext();

const STORAGE_KEY = "_mapmyprep_userprogress_v1";

export function UserProgressProvider({children}) {
  const [progress, setProgress] = useState(() => {
    try {
      const d = window.localStorage.getItem(STORAGE_KEY);
      return d
        ? { ...JSON.parse(d), syllabusStats: {totalTopics:0, completed:0}}
        : {
            points: 0,
            streak: 0,
            lastActive: "",
            focusHistory: [],
            recaps: [],
            syllabusStats: { totalTopics:0, completed:0 }
          };
    } catch {
      return {
        points: 0,
        streak: 0,
        lastActive: "",
        focusHistory: [],
        recaps: [],
        syllabusStats: { totalTopics:0, completed:0 }
      };
    }
  });

  // Persist progress on state change
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...progress,
      // Avoid storing non-serializable data in syllabusStats; it's a consumer-side, derived property.
      syllabusStats: undefined
    }));
  }, [progress]);

  // Update syllabusStats (called by SyllabusProvider consumer)
  const updateSyllabusStats = useCallback((stats) => {
    setProgress(prev => ({
      ...prev,
      syllabusStats: stats
    }));
  }, []);

  // Focus session: Add focus seconds for today, recalc streaks if needed
  const addFocusSession = useCallback((seconds) => {
    const today = new Date().toISOString().slice(0,10);
    setProgress(prev => {
      // Add session or sum if today already exists
      let history = prev.focusHistory.slice();
      const idx = history.findIndex(x => x.date === today);
      if (idx >= 0) {
        history[idx] = { ...history[idx], seconds: history[idx].seconds + seconds };
      } else {
        history.push({ date: today, seconds });
      }
      // If lastActive was yesterday, increment streak; if more than one day ago, reset streak.
      const now = new Date(today);
      const last = prev.lastActive ? new Date(prev.lastActive) : null;
      let streak = prev.streak || 0;
      if (last) {
        const diff = (now - last) / (1000*60*60*24);
        if (diff === 1) streak += 1;
        else if (diff > 1) streak = 1; // Missed days
      } else {
        streak = 1;
      }
      // Reward: +1 point per 15 min (900s)
      let points = prev.points + Math.floor(seconds / 900);
      return {
        ...prev,
        focusHistory: history,
        lastActive: today,
        streak: streak,
        points: points
      };
    });
  }, []);

  // Claim a reward (subtract points)
  const claimReward = useCallback((cost) => {
    setProgress(prev => ({
      ...prev,
      points: prev.points >= cost ? prev.points - cost : prev.points
    }));
  }, []);

  // Add a recap summary entry for today
  const addRecap = useCallback((text) => {
    setProgress(prev => ({
      ...prev,
      recaps: [
        ...prev.recaps,
        { text, time: new Date().toISOString() }
      ]
    }));
  }, []);

  // Reset everything for fresh user
  const resetUserProgress = useCallback(() => {
    setProgress({
      points: 0,
      streak: 0,
      lastActive: "",
      focusHistory: [],
      recaps: [],
      syllabusStats: { totalTopics:0, completed:0 }
    });
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <UserProgressContext.Provider value={{
      progress,
      setProgress,
      addFocusSession,
      claimReward,
      addRecap,
      updateSyllabusStats,
      resetUserProgress
    }}>
      {children}
    </UserProgressContext.Provider>
  );
}
