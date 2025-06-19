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
 * Fetches live data (scraped from official/credible sites) rather than local/demo/static files.
 * No demo/static fallback is provided.
 * Properly rejects with a descriptive error message if unsupported or retrieval fails.
 * Callers must react to loading and error state in UI.
 */
export async function fetchSyllabusFromWeb(exam) {
  if (!exam) throw new Error("No exam selected.");
  const normalized = String(exam).toUpperCase();
  let url = "";
  // Choose an API route (proxy/back script) per exam
  if (normalized === "NEET") {
    // Backend util writes to /utils/syllabus_neet.json; here, fetch proxy endpoint (future: via backend API)
    url = "/api/syllabus?exam=NEET";
  } else if (normalized === "JEE") {
    url = "/api/syllabus?exam=JEE";
  } else {
    throw new Error("Live auto-fetch only supported for NEET and JEE presently.");
  }
  try {
    // This endpoint should be backed by a live fetch service (must be implemented on backend or mocked)
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      // Pass through API status and body if available
      let msg = await res.text();
      throw new Error(msg || `Failed to fetch syllabus for ${exam} (status ${res.status})`);
    }
    const json = await res.json();
    // Validate expected shape: array of {subject, topics: [...]}
    if (!Array.isArray(json)) throw new Error("Malformed syllabus received.");
    return json;
  } catch (e) {
    throw new Error(
      `Syllabus fetch error: ${e.message || e.toString()}`
    );
  }
}
// Util: Generate a unique id (simple alternative for this scope)
/** Generate unique IDs for syllabus entries (not for production use) */
let __id_counter = 1;
function uniqueId() {
  return "__s" + (__id_counter++);
}

/**
 * PUBLIC_INTERFACE
 * Context to store the user's syllabus and progress across all relevant modules.
 *
 * The syllabus state is now strictly based on live-fetched syllabus JSON imported by the user
 * after web retrieval (no demo/sample is bundled or permissible).
 * 
 * Syllabus state structure example (topics, nesting allowed):
 * [
 *   { id: 'm1', label: 'Math', completed: false, children: [
 *       { id:'a1', label:'Algebra', completed:true }, ...
 *   ] },
 *   { id: 's1', label: 'Science', ... }
 * ]
 * - All features/components must treat "syllabus == []" as empty (show upload/import/fetch required),
 *   and respect that the live web-fetch is the only supported import method going forward.
 */
export const SyllabusContext = createContext();

/**
 * PUBLIC_INTERFACE
 * Provides the syllabus context to consumers.
 *
 * Note: Syllabus is only imported via live web fetch and user action, not via any static/hardcoded data.
 * Consumers should display loading and error states as warranted by the live fetch.
 */
export function SyllabusProvider({ children }) {
  const [syllabus, setSyllabus] = useState(() => {
    // Only previously imported syllabus is stored (no bundled demo in localStorage anymore)
    try {
      const d = window.localStorage.getItem("_edumentor_syllabus_v1");
      return d ? JSON.parse(d) : [];
    } catch {
      return [];
    }
  });

  // Bring in progress context to update real stats, points, streaks (etc.)
  const { updateSyllabusStats } = useContext(UserProgressContext ?? {});

  // Helper to flatten syllabus for stat calculation
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

  // On syllabus update: persist & send updated stats to progress context.
  useEffect(() => {
    window.localStorage.setItem("_edumentor_syllabus_v1", JSON.stringify(syllabus));
    // Compute and update aggregate stats for scoring and recaps:
    if (updateSyllabusStats) {
      const all = flattenSyllabus(syllabus);
      const totalTopics = all.length;
      const completed = all.filter(t => t.completed).length;
      updateSyllabusStats({ totalTopics, completed });
    }
    // Do NOT trigger a point/streak reward here (that is handled by user actions, e.g., addFocusSession, etc.)
  }, [syllabus, updateSyllabusStats]);

  function addTopic(label) {
    setSyllabus((curr) => [
      ...curr,
      { id: uniqueId(), label, children: [], completed: false }
    ]);
  }
  function addSubtopic(parentId, sublabel) {
    setSyllabus((curr) => deepUpdate(curr, parentId, (topic) => {
      if (!topic.children) topic.children = [];
      topic.children.push({ id: uniqueId(), label: sublabel, completed: false });
      return topic;
    }));
  }

  // Mark completion for given topic/subtopic id, toggling value
  function updateProgress(topicId) {
    setSyllabus((curr) =>
      deepUpdate(curr, topicId, (topic) => {
        topic.completed = !topic.completed;
        // Propagate completion down to children as needed
        if (topic.children && topic.children.length > 0) {
          topic.children = markAllChildren(topic.children, topic.completed);
        }
        return topic;
      })
    );
  }

  /** Recursively updates node with matching id with given updater */
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
  function markAllChildren(children, completedValue) {
    return children.map((c) => ({
      ...c,
      completed: completedValue,
      ...(c.children ? { children: markAllChildren(c.children, completedValue) } : {})
    }));
  }

  function resetSyllabus() {
    setSyllabus([]);
    window.localStorage.removeItem("_edumentor_syllabus_v1");
  }

  /** Allow user to upload their own syllabus (.json format) */
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
