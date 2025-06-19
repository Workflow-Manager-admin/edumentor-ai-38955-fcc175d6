import React, { useContext, useEffect, useState } from "react";
import { SyllabusContext } from "./SyllabusContext";
import { ExamContext } from "./ExamContext";

/**
 * PUBLIC_INTERFACE
 * StudyPlanner: Generates study plan ONLY from a live web-fetched syllabus.
 *
 * - Never loads static, hardcoded, or demo data.
 * - Blocks all planning and disables plan features if syllabus is not available or from fetch fails.
 * - Shows clear loading or error UI for syllabus fetch/failure.
 * - All logic depends solely on the real, imported syllabus from web.
 */

function defaultSuggestedHours(depth = 0) {
  // Simple baseline: subject=20h, topic=8h, subtopic=2h
  if (depth === 0) return 20;
  if (depth === 1) return 8;
  return 2;
}

function addPlanFields(tree, startDate = null, planDays = 90, depth = 0, idPath = []) {
  // <tree>: [{id,label,children}] or [{subject,topics}]
  // Recursively walk tree to create flat sequential schedule for topics/subtopics
  let plan = [];
  let seq = 0;
  let nextStart = startDate ? new Date(startDate) : new Date();
  function walk(item, d = 0, pathStack = []) {
    let path = pathStack.concat(item.id || item.topic || item.subject);
    let baseLabel = item.label || item.topic || item.subject;
    let hours = defaultSuggestedHours(d);
    let entry = {
      id: item.id || baseLabel+Math.random().toString(36).slice(2,7),
      path,
      label: baseLabel,
      type: d === 0 ? "subject" : (d === 1 ? "topic" : "subtopic"),
      suggestedHours: hours,
      customizableHours: hours,
      startDate: null, // will be filled after tree walk
      endDate: null,
      checkpoints: [],
      order: seq++,
      children: []
    };
    // If subtopics or children, handle them recursively
    if (item.children && Array.isArray(item.children)) {
      entry.children = item.children.map(child => walk(child, d+1, path));
      // Flatten child plan entries to plan[]
      entry.children.forEach(ch => plan.push(ch));
    } else if (item.topics) { // "subject" -> topics[]
      entry.children = item.topics.map(t => walk(t, d+1, path));
      entry.children.forEach(ch => plan.push(ch));
    } else if (item.subtopics) { // topic -> subtopics[]
      entry.children = item.subtopics.map(t => walk({label: t}, d+1, path));
      entry.children.forEach(ch => plan.push(ch));
    }
    // After descending, assign dates for independent/leaf entries
    plan.push(entry);
    return entry;
  }
  // Kick off - might be syllabus array, or subject array
  if (Array.isArray(tree)) {
    tree.forEach(n => walk(n, depth, idPath));
  }
  // Now set the start/end dates sequentially (naive even distribution)
  const totalHours = plan.reduce((a,c) => a + (c.suggestedHours||0), 0);
  const daysAlloc = Math.max(plan.length, planDays); // buffer for now
  let perHourDay = daysAlloc / totalHours;
  let d = new Date(startDate || Date.now());
  plan.forEach(entry => {
    let hours = entry.suggestedHours || 1;
    let topicDays = Math.round(perHourDay * hours);
    let start = new Date(d);
    let end = new Date(d);
    end.setDate(end.getDate() + topicDays - 1);
    entry.startDate = start.toISOString().slice(0,10);
    entry.endDate = end.toISOString().slice(0,10);
    // Add simple checkpoints: 1 at halfway for long blocks, else at end
    entry.checkpoints = (hours >= 10)
      ? [ { milestone: "Halfway", date: new Date(start.getTime() + ((end-start)/2)).toISOString().slice(0,10) } ]
      : [ { milestone: "Finish", date: entry.endDate } ];
    d = new Date(end);
    d.setDate(d.getDate()+1);
  });
  // Only root-level unique plans (filter duplicates)
  const ids = new Set();
  plan = plan.filter(e => {
    if (!ids.has(e.id)) { ids.add(e.id); return true;}
    return false;
  });
  return plan;
}

function getStorageKey(exam) {
  return exam ? `_edumentor_studyplan_${exam.toLowerCase()}_v1` : `_edumentor_studyplan_DEFAULT_v1`;
}

export function StudyPlanner({ planDays = 90 }) {
  const { syllabus } = useContext(SyllabusContext);
  const { exam } = useContext(ExamContext);
  const [plan, setPlan] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // New: track loading/error/empty state for web-fetched syllabus
  const [syllabusStatus, setSyllabusStatus] = useState("idle"); // "loading", "error", "ready", "empty"
  const [syllabusError, setSyllabusError] = useState("");

  useEffect(() => {
    // Simulate syllabus state check/status (now: syllabus only from live fetch/import)
    if (!Array.isArray(syllabus)) {
      setSyllabusStatus("error");
      setSyllabusError("Internal error with syllabus format.");
    } else if (syllabus.length > 0) {
      setSyllabusStatus("ready");
      setSyllabusError("");
    } else {
      setSyllabusStatus("empty");
      setSyllabusError("");
    }
  }, [syllabus]);

  // Do not auto-populate plan if syllabus empty or absent (must live fetch/import).
  useEffect(() => {
    // If syllabus is provided and valid, compute/generate plan, else block and clear plan.
    if (Array.isArray(syllabus) && syllabus.length > 0) {
      const key = getStorageKey(exam);
      let saved = null;
      try {
        saved = window.localStorage.getItem(key);
        saved = saved ? JSON.parse(saved) : null;
      } catch {}
      if (saved && Array.isArray(saved)) {
        setPlan(saved);
      } else {
        const initial = addPlanFields(syllabus, null, planDays);
        setPlan(initial);
        window.localStorage.setItem(key, JSON.stringify(initial));
      }
    } else {
      // Absolutely block plan if no syllabus - don't allow fallback
      setPlan([]);
    }
  }, [syllabus, exam, planDays]);

  // Save on plan update
  useEffect(() => {
    if (plan.length) {
      window.localStorage.setItem(getStorageKey(exam), JSON.stringify(plan));
    }
  }, [plan, exam]);

  function handleExpand(id) {
    setExpanded(exp => ({ ...exp, [id]: !exp[id] }));
  }

  function handleChange(idx, field, value) {
    setPlan(pl => pl.map((entry, i) =>
      i === idx ? { ...entry, [field]: value } : entry
    ));
  }

  function handleCheckpointChange(idx, ci, field, value) {
    setPlan(pl => pl.map((entry, i) =>
      i === idx
        ? {
            ...entry,
            checkpoints: entry.checkpoints.map((cp, k) =>
              k === ci ? { ...cp, [field]: value } : cp
            )
          }
        : entry
    ));
  }

  function handleOrderChange(idx, dir) {
    // Move item up or down in plan
    setPlan(pl => {
      const arr = pl.slice();
      if (dir === "up" && idx > 0) {
        [arr[idx-1], arr[idx]] = [arr[idx], arr[idx-1]];
      } else if (dir === "down" && idx < arr.length-1) {
        [arr[idx], arr[idx+1]] = [arr[idx+1], arr[idx]];
      }
      return arr.map((e,i) => ({...e, order:i}));
    });
  }

  function handleEditToggle() {
    setIsEditing(v => !v);
  }

  function renderCheckpoints(entry, idx, editable) {
    return (
      <div>
        <b>Checkpoints:</b>
        {entry.checkpoints.map((cp, ci) => (
          <div key={ci} style={{ marginLeft: 9 }}>
            {editable ? (
              <>
                <input
                  type="text"
                  value={cp.milestone}
                  onChange={e => handleCheckpointChange(idx, ci, "milestone", e.target.value)}
                  style={{ width: 80, marginRight: 7 }}
                  />
                <input
                  type="date"
                  value={cp.date}
                  onChange={e => handleCheckpointChange(idx, ci, "date", e.target.value)}
                  style={{ width: 120 }}
                  />
              </>
            ): (
              <>
                <span>{cp.milestone} — {cp.date}</span>
              </>
            )}
          </div>
        ))}
        {/* For now, no add/delete, only edit the milestone/date fields */}
      </div>
    );
  }

  function renderPlanEntry(entry, idx, editable) {
    return (
      <div key={entry.id} className="card"
        style={{
          marginBottom: 12,
          background: entry.type === "subject" ? "var(--surface)" : "#f7fbff",
          borderColor: entry.type === "subject" ? "var(--primary)" : "var(--border)",
          paddingLeft: entry.type === "subject" ? 12 : entry.type === "topic" ? 30 : 54
        }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {["subject","topic"].includes(entry.type) && (
            <button
              style={{
                marginRight: 6,
                background: "none",
                border: "none",
                fontSize: 18,
                cursor: "pointer",
                color: "var(--primary)"
              }}
              onClick={() => handleExpand(entry.id)}
              aria-label={expanded[entry.id] ? "Collapse" : "Expand"}
            >
              {expanded[entry.id] ? "▼" : "▶"}
            </button>
          )}
          <b>{entry.label}</b>
          <span style={{ marginLeft: 11, color: "var(--muted)", fontSize: "0.93em" }}>
            [{entry.type}]
          </span>
        </div>
        {(entry.type === "subtopic" || expanded[entry.id]) && (
          <div style={{ marginTop: 8 }}>
            <label>
              Study Hours:
              <input
                type="number"
                min={1}
                max={200}
                value={entry.customizableHours}
                disabled={!editable}
                style={{ marginLeft: 7, width:70 }}
                onChange={e => editable && handleChange(idx, "customizableHours", Number(e.target.value))}
              />
            </label>
            <span style={{ marginLeft: 11 }}></span>
            <label>
              Start:
              <input
                type="date"
                value={entry.startDate}
                disabled={!editable}
                style={{ marginLeft: 7, width:120 }}
                onChange={e => editable && handleChange(idx, "startDate", e.target.value)}
              />
            </label>
            <span style={{ marginLeft: 13 }}></span>
            <label>
              End:
              <input
                type="date"
                value={entry.endDate}
                disabled={!editable}
                style={{ marginLeft: 7, width:120 }}
                onChange={e => editable && handleChange(idx, "endDate", e.target.value)}
              />
            </label>
            <div style={{ marginTop: 6 }}>
              {renderCheckpoints(entry, idx, editable)}
            </div>
            {editable && (
              <div style={{ marginTop: 7 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => handleOrderChange(idx, "up")}
                  disabled={idx === 0}
                  style={{ marginRight: 4 }}
                >↑</button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => handleOrderChange(idx, "down")}
                  disabled={idx === plan.length-1}
                >↓</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 820, marginBottom: 24 }}>
      <h2 className="card-title">Study Planner & Syllabus Breakdown</h2>
      <div style={{ color: "var(--muted)", marginBottom: 12 }}>
        Syllabus must be fetched from the official source. All planner features are disabled unless a live syllabus is available.
      </div>
      {syllabusStatus === "loading" && (
        <div style={{ color: "var(--secondary)", fontWeight: 500, marginBottom: 10 }}>
          Loading syllabus data from the web&hellip;
        </div>
      )}
      {syllabusStatus === "empty" && (
        <div style={{ color: "#FF3742", fontWeight: 500 }}>
          <span>
            <b>No syllabus loaded.</b> <br />
            Please use the "Auto Fetch Official Syllabus" feature or import the latest syllabus for your exam to generate a plan.
          </span>
        </div>
      )}
      {syllabusStatus === "error" && (
        <div style={{ color: "#FF3742", fontWeight: 500 }}>
          <b>Failed to fetch the syllabus:</b> {syllabusError || "Unknown error"}.
          <br />
          Please try re-importing your syllabus.
        </div>
      )}
      {syllabusStatus === "ready" && plan.length === 0 && (
        <div style={{ color: "var(--muted)" }}>
          Syllabus imported, but no plan generated. Try reloading or refetching the syllabus.
        </div>
      )}
      {syllabusStatus === "ready" && plan.length > 0 && (
        <>
          <div style={{ marginBottom: 10 }}>
            <button
              className="btn"
              style={{ background: isEditing ? "var(--accent)" : "var(--primary)" }}
              onClick={handleEditToggle}
            >
              {isEditing ? "Done Editing" : "Edit Study Plan"}
            </button>
          </div>
          <div>
            {plan.map((entry, idx) => renderPlanEntry(entry, idx, isEditing))}
          </div>
        </>
      )}
      {(syllabusStatus !== "ready") && (
        <div style={{ color: "#aaa", marginTop: 25, fontSize: "1.04em" }}>
          <b>Planner actions (edit, schedule, etc.) will unlock only after a valid, live syllabus is loaded for your exam.</b>
        </div>
      )}
      <div style={{ marginTop: 12, color: "var(--muted)", fontSize:"0.96em" }}>
        <b>Note:</b> Editing the study plan affects only your local saved planner and does not change the original syllabus.
      </div>
    </div>
  );
}

export default StudyPlanner;
