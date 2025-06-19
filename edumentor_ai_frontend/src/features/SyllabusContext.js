import React, { createContext, useState, useEffect, useContext } from "react";
import { UserProgressContext } from "./UserProgressContext";

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
 * Syllabus state structure example (topics, nesting allowed):
 * [
 *   { id: 'm1', label: 'Math', completed: false, children: [
 *       { id:'a1', label:'Algebra', completed:true }, ...
 *   ] },
 *   { id: 's1', label: 'Science', ... }
 * ]
 */
export const SyllabusContext = createContext();

/**
 * PUBLIC_INTERFACE
 * Provides the syllabus context to consumers.
 */
export function SyllabusProvider({ children }) {
  const [syllabus, setSyllabus] = useState(() => {
    // Try loading previously saved/entered syllabus from localStorage
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
