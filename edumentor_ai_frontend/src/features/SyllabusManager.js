import React, { useContext, useRef, useState } from "react";
import { SyllabusContext } from "./SyllabusContext";

/**
 * PUBLIC_INTERFACE
 * Allows user to upload, view, and reset their syllabus structure for use throughout the dashboard.
 */
export function SyllabusManager() {
  const { syllabus, importSyllabus, resetSyllabus } = useContext(SyllabusContext);
  const fileRef = useRef();
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setError("");
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (!Array.isArray(parsed)) throw new Error("Must be array of topics.");
        importSyllabus(parsed);
      } catch (err) {
        setError("Invalid JSON syllabus: " + err.message);
      }
    };
    reader.readAsText(f);
  };

  return (
    <div className="card" style={{ maxWidth: 470, marginBottom: 18 }}>
      <h2 className="card-title">
        Syllabus Manager
      </h2>
      <div style={{ fontSize: "0.96em", color: "var(--muted)", marginBottom: 7 }}>
        Import a syllabus (as JSON array of topic/subtopic objects).
      </div>
      <input
        type="file"
        accept=".json,application/json"
        ref={fileRef}
        onChange={handleFileChange}
        style={{ marginBottom: 9 }}
      />
      <button
        className="btn btn-outline"
        style={{ marginRight: 7 }}
        onClick={resetSyllabus}
        type="button"
      >
        Clear Syllabus
      </button>
      {error && (
        <div style={{ color: "#FF3742", marginTop: 8 }}>{error}</div>
      )}
      <div style={{ color: "var(--muted)", marginTop: 8 }}>
        Example format: <br />
        <code>[&#123; "id": "m1", "label": "Math", "children": [&#123;"id": "a1", "label":"Algebra"&#125;]&#125;]</code>
      </div>
      <div style={{ marginTop: 10 }}>
        <b>Current Syllabus Topics ({syllabus.length}):</b>
        <ul style={{ marginTop: 5, color: "var(--primary)", paddingLeft: 20 }}>
          {syllabus.map((t) => (
            <li key={t.id}>{t.label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
