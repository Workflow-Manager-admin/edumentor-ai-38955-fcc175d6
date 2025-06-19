import React, { useContext, useState, useEffect } from "react";
import { useExam } from "./ExamContext";
import { useExamPrepDates } from "./ExamPrepDatesContext";
import { SyllabusContext, fetchSyllabusFromWeb } from "./SyllabusContext";

/**
 * PUBLIC_INTERFACE
 * SyllabusAutoImporter: Fetches and displays the official syllabus after exam and dates selection.
 * Offers import to current user syllabus, shows expandable outline for preview.
 */
export default function SyllabusAutoImporter() {
  const { exam } = useExam();
  const { startDate, examDate } = useExamPrepDates();
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState("");
  const { importSyllabus } = useContext(SyllabusContext);

  // Whether syllabus can be (re)fetched
  const canFetch = !!exam && !!startDate && !!examDate;

  // On mount or when exam/startDate/examDate change, if all set, auto-fetch syllabus
  useEffect(() => {
    let done = false;
    if (!canFetch) return;
    setLoading(true);
    setError("");
    setSyllabus([]); // Clear before refetch for UI
    fetchSyllabusFromWeb(exam)
      .then(data => {
        if (!done) setSyllabus(data);
      })
      .catch(e => {
        if (!done) setError(e.message);
      })
      .finally(() => {
        if (!done) setLoading(false);
      });
    return () => {
      done = true;
    };
    // eslint-disable-next-line
  }, [exam, startDate, examDate]);

  async function fetchSyllabusHandler() {
    setError("");
    setLoading(true);
    try {
      const data = await fetchSyllabusFromWeb(exam);
      setSyllabus(data);
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleExpand(key) {
    setExpanded(exp => ({ ...exp, [key]: !exp[key] }));
  }

  function handleImport() {
    // Transform syllabus to match local format (expand subject/topics -> id/label/children)
    function normalize(tree) {
      // Tree: [{subject,topics:[{topic,subtopics:[]?}]}]
      if (!Array.isArray(tree)) return [];
      return tree.map(subject => ({
        id: "s_"+subject.subject.replace(/\s+/g, "_"),
        label: subject.subject,
        completed: false,
        children: Array.isArray(subject.topics)
          ? subject.topics.map(topic => ({
              id: "t_"+topic.topic.replace(/\s+/g, "_")+(Math.random().toString(36).slice(2,7)),
              label: topic.topic,
              completed: false,
              children: Array.isArray(topic.subtopics)
                ? topic.subtopics.map(sub =>
                    typeof sub === "string"
                      ? {
                          id: "st_"+sub.replace(/\s+/g, "_")+(Math.random().toString(36).slice(2,7)),
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

  function renderTree(tree, depth=0, prefix="") {
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
      <h2 className="card-title">Auto Fetch Official Syllabus</h2>
      <div style={{ color: "var(--muted)", marginBottom: 8, fontSize: "0.97em" }}>
        The official syllabus for <b>{exam || "selected exam"}</b> is retrieved automatically and shown below
        once you've set your preparation and exam dates.
        You can expand/collapse subjects and topics for a preview.
      </div>
      <div style={{ marginBottom: 10 }}>
        <button
          className="btn"
          onClick={fetchSyllabusHandler}
          disabled={!canFetch || loading}
          style={{ background: "var(--secondary)", minWidth: 120 }}
        >
          {loading ? "Fetching..." : "Refetch Syllabus"}
        </button>
        {syllabus.length > 0 && (
          <button
            className="btn"
            style={{ marginLeft: 12, background: "var(--accent)" }}
            onClick={handleImport}
          >
            Import to My Syllabus
          </button>
        )}
      </div>
      {error && <div style={{ color: "#FF3742", fontWeight: 500, marginBottom: 6 }}>{error}</div>}
      {loading && (
        <div style={{ color: "var(--secondary)", fontWeight: 500, marginBottom: 6 }}>Loading syllabus&hellip;</div>
      )}
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
