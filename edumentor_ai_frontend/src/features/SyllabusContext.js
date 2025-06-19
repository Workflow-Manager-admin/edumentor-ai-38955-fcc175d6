import React, { createContext, useState, useEffect, useContext } from "react";
import { UserProgressContext } from "./UserProgressContext";
import neetSyllabus from "../data/neet_syllabus.json";
import jeeSyllabus from "../data/jee_syllabus.json";

/**
 * PUBLIC_INTERFACE
 * Immediately returns static syllabus data for NEET or JEE.
 *
 * @param {string} exam - The selected exam name (e.g. "NEET", "JEE").
 * @returns {Promise<Array>} - Array of {subject, topics: [{topic, subtopics}]} loaded directly from static import.
 * @throws Error if unsupported exam is selected.
 *
 * This never fetches data from web or API, and always resolves instantly with the static bundle.
 **/
export async function fetchSyllabusFromWeb(exam) {
  if (!exam) throw new Error("No exam selected.");
  const normalized = String(exam).toUpperCase();
  if (normalized === "NEET") {
    if (!Array.isArray(neetSyllabus)) throw new Error("Malformed NEET syllabus data.");
    return neetSyllabus;
  } else if (normalized === "JEE") {
    if (!Array.isArray(jeeSyllabus)) throw new Error("Malformed JEE syllabus data.");
    return jeeSyllabus;
  } else {
    throw new Error("Official syllabus only bundled for NEET and JEE.");
  }
}

// Utility: Generate unique IDs for imported/created syllabus entries
let __id_counter = 1;
function uniqueId() {
  return "__s" + (__id_counter++);
}

/**
 * PUBLIC_INTERFACE
 * Context to store the user's syllabus (static, exam-dependent) and provide progress manipulation methods.
 *
 * When user selects NEET or JEE, the syllabus is imported synchronously from static JSON (via import), and appears immediately in UI.
 * Manual and file-import (custom) still supported.
 */
export const SyllabusContext = createContext();

/**
 * PUBLIC_INTERFACE
 * SyllabusProvider: makes syllabus and update functions available to descendants.
 *
 * - Syllabus is imported via context-native logic, using instant static bundle for NEET/JEE after exam select.
 * - UI consuming this context will always see the syllabus immediately for NEET/JEE after selection.
 */
export function SyllabusProvider({ children }) {
  const [syllabus, setSyllabus] = useState(() => {
    try {
      const d = window.localStorage.getItem("_mapmyprep_syllabus_v1");
      return d ? JSON.parse(d) : [];
    } catch {
      return [];
    }
  });

  // Bring in progress context for aggregate stats
  const { updateSyllabusStats } = useContext(UserProgressContext ?? {});

  // Helper to flatten for stats
  function flattenSyllabus(items) {
    let arr = [];
    for (const t of items) {
      arr.push(t);
      if (Array.isArray(t.children) && t.children.length > 0) {
        arr = arr.concat(flattenSyllabus(t.children));
      }
    }
    return arr;
  }

  // Persist syllabus and update progress stats
  useEffect(() => {
    window.localStorage.setItem("_mapmyprep_syllabus_v1", JSON.stringify(syllabus));
    if (updateSyllabusStats) {
      const all = flattenSyllabus(syllabus);
      const totalTopics = all.length;
      const completed = all.filter(t => t.completed).length;
      updateSyllabusStats({ totalTopics, completed });
    }
  }, [syllabus, updateSyllabusStats]);

  // --- Public syllabus context API ---

  // Add a (root) topic (Manual add, NOT part of automated study planner)
  function addTopic(label) {
    setSyllabus((curr) => [
      ...curr,
      { id: uniqueId(), label, children: [], completed: false }
    ]);
  }

  // Add a subtopic to a (topic or parent), given parent id
  function addSubtopic(parentId, sublabel) {
    setSyllabus((curr) => deepUpdate(curr, parentId, (topic) => {
      if (!topic.children) topic.children = [];
      topic.children.push({ id: uniqueId(), label: sublabel, completed: false });
      return topic;
    }));
  }

  // Mark any topic or subtopic as completed/not-completed
  function updateProgress(topicId) {
    setSyllabus((curr) =>
      deepUpdate(curr, topicId, (topic) => {
        topic.completed = !topic.completed;
        // Propagate completion to children if any
        if (topic.children && topic.children.length > 0) {
          topic.children = markAllChildren(topic.children, topic.completed);
        }
        return topic;
      })
    );
  }

  // Recursively deep-update syllabus for a node id and updater function
  function deepUpdate(list, searchId, updater) {
    return list.map((item) => {
      if (item.id === searchId) {
        return updater({ ...item });
      }
      if (item.children) {
        return {
          ...item,
          children: deepUpdate(item.children, searchId, updater)
        };
      }
      return item;
    });
  }

  // Recursively mark all children (for propagate-completion)
  function markAllChildren(children, completedValue) {
    return children.map((c) => ({
      ...c,
      completed: completedValue,
      ...(c.children ? { children: markAllChildren(c.children, completedValue) } : {})
    }));
  }

  // Remove syllabus and clear localStorage
  function resetSyllabus() {
    setSyllabus([]);
    window.localStorage.removeItem("_mapmyprep_syllabus_v1");
  }

  // Imports syllabus (from static, directly, or manual upload)
  function importSyllabus(json) {
    setSyllabus(Array.isArray(json) ? json : []);
  }

  // Synchronously set syllabus based on selected exam
  function importSyllabusForExam(exam) {
    if (!exam) return;
    const normalized = String(exam).toUpperCase();
    if (normalized === "NEET") {
      setSyllabus(Array.isArray(neetSyllabus) ? neetSyllabus : []);
    } else if (normalized === "JEE") {
      setSyllabus(Array.isArray(jeeSyllabus) ? jeeSyllabus : []);
    }
  }

  return (
    <SyllabusContext.Provider
      value={{
        syllabus,
        addTopic,
        addSubtopic,
        updateProgress,
        importSyllabus,
        importSyllabusForExam,
        resetSyllabus,
      }}
    >
      {children}
    </SyllabusContext.Provider>
  );
}
