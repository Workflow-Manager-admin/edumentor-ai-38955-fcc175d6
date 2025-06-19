import React, { createContext, useState, useEffect, useContext } from "react";
import { UserProgressContext } from "./UserProgressContext";
import neetSyllabus from "../data/neet_syllabus.json";
import jeeSyllabus from "../data/jee_syllabus.json";

// PUBLIC_INTERFACE
// Context to hold user's syllabus (static, local-only) and methods.
export const SyllabusContext = createContext();

// Utility: Generate unique IDs for manual additions.
let __id_counter = 1;
function uniqueId() {
  return "__s" + (__id_counter++);
}

// PUBLIC_INTERFACE
// SyllabusProvider makes syllabus and updater methods available to descendants.
// Syllabus is instantly imported from static NEET/JEE JSON based on exam selection only.
export function SyllabusProvider({ children }) {
  const [syllabus, setSyllabus] = useState(() => {
    try {
      const d = window.localStorage.getItem("_mapmyprep_syllabus_v1");
      return d ? JSON.parse(d) : [];
    } catch {
      return [];
    }
  });

  // Bring in progress context for aggregate stats (safe fallback to undefined).
  const { updateSyllabusStats } = useContext(UserProgressContext ?? {});

  // Helper: flatten tree for stats
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

  // Keep syllabus in localStorage & update stats
  useEffect(() => {
    window.localStorage.setItem("_mapmyprep_syllabus_v1", JSON.stringify(syllabus));
    if (updateSyllabusStats) {
      const all = flattenSyllabus(syllabus);
      const totalTopics = all.length;
      const completed = all.filter(t => t.completed).length;
      updateSyllabusStats({ totalTopics, completed });
    }
  }, [syllabus, updateSyllabusStats]);

  // Public context methods (with all fetch/web/api/loader logic removed)
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

  function updateProgress(topicId) {
    setSyllabus((curr) =>
      deepUpdate(curr, topicId, (topic) => {
        topic.completed = !topic.completed;
        if (topic.children && topic.children.length > 0) {
          topic.children = markAllChildren(topic.children, topic.completed);
        }
        return topic;
      })
    );
  }

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
    window.localStorage.removeItem("_mapmyprep_syllabus_v1");
  }

  function importSyllabus(json) {
    setSyllabus(Array.isArray(json) ? json : []);
  }

  // PUBLIC_INTERFACE
  // Instantly set syllabus to static NEET or JEE JSON based on selection.
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
