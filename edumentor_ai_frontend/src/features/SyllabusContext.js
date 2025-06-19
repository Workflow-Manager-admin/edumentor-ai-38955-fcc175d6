import React, { createContext, useState, useEffect, useContext } from "react";
import { UserProgressContext } from "./UserProgressContext";

/**
 * PUBLIC_INTERFACE
 * Fetches the official syllabus from the live web for a given entrance exam.
 * 
 * @param {string} exam - The selected exam name (e.g. "NEET", "JEE").
 * @returns {Promise<Array>} - Array of {subject, topics: [{topic, subtopics}]} obtained by scraping/parsing the official/latest syllabus.
 * @throws Error when fetch or parse fails.
 *
 * This fetches live data only; no static/demo fallback is allowed.
 * Properly rejects with a descriptive error message if unsupported or retrieval fails.
 * Callers must handle all loading and error states in UI.
 */
export async function fetchSyllabusFromWeb(exam) {
  if (!exam) throw new Error("No exam selected.");
  const normalized = String(exam).toUpperCase();
  let url = "";
  // Choose the API endpoint per exam
  if (normalized === "NEET") {
    url = "/api/syllabus?exam=NEET";
  } else if (normalized === "JEE") {
    url = "/api/syllabus?exam=JEE";
  } else {
    throw new Error("Live auto-fetch only supported for NEET and JEE presently.");
  }
  try {
    // Live fetch (must be implemented by backend)
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      let msg = await res.text();
      throw new Error(msg || `Failed to fetch syllabus for ${exam} (status ${res.status})`);
    }
    const json = await res.json();
    if (!Array.isArray(json)) throw new Error("Malformed syllabus received.");
    return json;
  } catch (e) {
    throw new Error(
      `Syllabus fetch error: ${e.message || e.toString()}`
    );
  }
}

// Utility: Generate unique IDs for imported/created syllabus entries
let __id_counter = 1;
function uniqueId() {
  return "__s" + (__id_counter++);
}

/**
 * PUBLIC_INTERFACE
 * Context to store the user's syllabus (live-fetched only) and provide progress manipulation methods.
 * 
 * The only valid way to import syllabus data is via web fetch & explicit user action. No bundled demo or static fallback is permitted.
 * 
 * Features/components must treat syllabus == [] as requiring import/fetch.
 */
export const SyllabusContext = createContext();

/**
 * PUBLIC_INTERFACE
 * SyllabusProvider: makes syllabus and update functions available to descendants.
 * 
 * - Syllabus is only imported by web fetch and explicit import.
 * - The context must NOT provide/demo any static/hardcoded syllabus in default empty state.
 * - Provide helper functions to update progress, import/clear syllabus, but never hardcode any actual data.
 * - UI consuming this context must present clear loading/error/empty states.
 */
export function SyllabusProvider({ children }) {
  const [syllabus, setSyllabus] = useState(() => {
    // Only import from localStorage; no static/hardcoded/demo
    try {
      const d = window.localStorage.getItem("_edumentor_syllabus_v1");
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
    window.localStorage.setItem("_edumentor_syllabus_v1", JSON.stringify(syllabus));
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
    window.localStorage.removeItem("_edumentor_syllabus_v1");
  }

  // Only path for import is user action (web-fetched syllabus supplied as JSON)
  function importSyllabus(json) {
    setSyllabus(Array.isArray(json) ? json : []);
  }

  return (
    <SyllabusContext.Provider
      value={{
        syllabus,
        addTopic,
        addSubtopic,
        updateProgress,
        importSyllabus,
        resetSyllabus,
      }}
    >
      {children}
    </SyllabusContext.Provider>
  );
}
