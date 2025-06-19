import React, { useContext, useState, useEffect } from "react";
import { useExam } from "./ExamContext";
import { useExamPrepDates } from "./ExamPrepDatesContext";
import { SyllabusContext } from "./SyllabusContext";
import neetSyllabus from "../data/neet_syllabus.json";
import jeeSyllabus from "../data/jee_syllabus.json";

/**
 * PUBLIC_INTERFACE
 * SyllabusAutoImporter: Instantly loads official syllabus from static file for selected exam & displays it.
 * Offers import to current user syllabus, shows expandable outline for preview.
 */
export default function SyllabusAutoImporter() {
  const { exam } = useExam();
  const { startDate, examDate } = useExamPrepDates();
  const [syllabus, setSyllabus] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState("");
  const { importSyllabus } = useContext(SyllabusContext);

  // Whenever exam/startDate/examDate change and all present, load static syllabus synchronously
  useEffect(() => {
    setError("");
    setExpanded({});
    if (!exam || !startDate || !examDate) {
      setSyllabus([]);
      return;
    }
    // Load the relevant static JSON synchronously (no fetch/async)
    const normalized = String(exam).toUpperCase();
    if (normalized === "NEET") {
      if (!Array.isArray(neetSyllabus)) {
        setSyllabus([]);
        setError("Malformed NEET syllabus data.");
      } else {
        setSyllabus(neetSyllabus);
      }
    } else if (normalized === "JEE") {
      if (!Array.isArray(jeeSyllabus)) {
        setSyllabus([]);
        setError("Malformed JEE syllabus data.");
      } else {
        setSyllabus(jeeSyllabus);
      }
    } else {
      setSyllabus([]);
      setError("Static syllabus only bundled for NEET and JEE.");
    }
    // eslint-disable-next-line
  }, [exam, startDate, examDate]);

  function handleExpand(key) {
    setExpanded(exp => ({ ...exp, [key]: !exp[key] }));
  }

  function handleImport() {
    // Transform syllabus to match local format (expand subject/topics -> id/label/children)
    function normalize(tree) {
      // Tree: [{subject,topics:[{topic,subtopics:[]?}]}]
      if (!Array.isArray(tree)) return [];
      return tree.map(subject => ({
        id: "s_" + String(subject.subject).replace(/\s+/g, "_"),
        label: subject.subject,
        completed: false,
        children: Array.isArray(subject.topics)
          ? subject.topics.map(topic => ({
              id: "t_" + String(topic.topic).replace(/\s+/g, "_") + (Math.random().toString(36).slice(2,7)),
              label: topic.topic,
              completed: false,
              children: Array.isArray(topic.subtopics)
                ? topic.subtopics.map(sub =>
                    typeof sub === "string"
                      ? {
                          id: "st_" + String(sub).replace(/\s+/g, "_") + (Math.random().toString(36).slice(2,7)),
                          label: sub,
                          completed: false
                        }
                      : null
                  ).filter(Boolean)
                : []
            }))
          : []
      }));
    }
    importSyllabus(normalize(syllabus));
  }

  function renderTree(tree, depth = 0, prefix = "") {
    if (!tree || !Array.isArray(tree)) return null;
    return (
      <ul style={{ listStyle: "none", paddingLeft: depth === 0 ? 0 : 18, margin: 0 }}>
        {tree.map((item, idx) => {
          // Subject: subject + topics; Topic: topic + subtopics
          const key = prefix + (item.subject || item.topic || idx);
          const label = item.subject || item.topic;
          const subs = item.topics || item.subtopics;
          const hasChildren = Array.isArray(subs) && subs.length > 0;
          return (
            <li key={key} style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: depth === 0 ? 700 : 500, color: "var(--primary)", display: "flex", alignItems: "center" }}>
                {hasChildren && (
                  <button
                    onClick={() => handleExpand(key)}
                    aria-label={expanded[key] ? "Collapse" : "Expand"}
                    style={{
                      marginRight: 7,
                      background: "none",
                      border: "none",
                      color: "var(--primary)",
                      cursor: "pointer",
                      fontSize: "1.08em"
                    }}
                  >
                    {expanded[key] ? "▼" : "▶"}
                  </button>
                )}
                <span>{label}</span>
              </div>
              {hasChildren && expanded[key] && renderTree(subs, depth + 1, key + "_")}
              {!hasChildren && item.label && (
                <div style={{ marginLeft: 24, color: "var(--muted)" }}>{item.label}</div>
              )}
              {!hasChildren && typeof item === "string" && (
                <div style={{ marginLeft: 24, color: "var(--muted)" }}>{item}</div>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 540, marginBottom: 15 }}>
      <h2 className="card-title">Official Syllabus Preview</h2>
      <div style={{ color: "var(--muted)", marginBottom: 8, fontSize: "0.97em" }}>
        The official syllabus for <b>{exam || "selected exam"}</b> is loaded from a static file and shown below
        once you've set your preparation and exam dates.
        You can expand/collapse subjects and topics for a preview.
      </div>
      <div style={{ marginBottom: 10 }}>
        {syllabus.length > 0 && (
          <button
            className="btn"
            style={{ background: "var(--accent)" }}
            onClick={handleImport}
          >
            Import to My Syllabus
          </button>
        )}
      </div>
      {error && <div style={{ color: "#FF3742", fontWeight: 500, marginBottom: 6 }}>{error}</div>}
      {syllabus.length > 0 && (
        <div
          style={{
            border: "1.2px solid var(--border)",
            background: "#f8fafc",
            borderRadius: 9,
            padding: "12px 9px 9px 13px",
            marginTop: 7,
            maxHeight: 300,
            overflowY: "auto"
          }}
        >
          {renderTree(syllabus)}
        </div>
      )}
      <div style={{ color: "var(--muted)", marginTop: 8, fontSize: "0.92em" }}>
        <b>Note:</b> Imported syllabus replaces your current syllabus. You can always edit or upload your own later.
      </div>
    </div>
  );
}
