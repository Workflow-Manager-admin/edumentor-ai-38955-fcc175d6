import React, { createContext, useState, useEffect } from "react";

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

  // Persist syllabus on change
  useEffect(() => {
    window.localStorage.setItem("_edumentor_syllabus_v1", JSON.stringify(syllabus));
  }, [syllabus]);

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
        // Optionally, propagate completion down to all children or up to parent, as needed
        if (topic.children && topic.children.length > 0) {
          topic.children = markAllChildren(topic.children, topic.completed);
        }
        // If marking off, also unmark all subtopics. 
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
