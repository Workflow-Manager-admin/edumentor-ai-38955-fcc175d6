import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Reminders and notification scheduling demo widget.
 */
export function RemindersNotifications() {
  const [reminder, setReminder] = useState("");
  const [saved, setSaved] = useState(false);

  // Demo reminders list
  const [reminders, setReminders] = useState([
    { id: 1, text: "Complete Biology reading", when: "Fri 7pm" },
    { id: 2, text: "Math assignment due", when: "Sun 11:59pm" }
  ]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (reminder.trim()) {
      setReminders((curr) => [
        ...curr,
        {
          id: Date.now(),
          text: reminder,
          when: "Next Week"
        }
      ]);
      setReminder("");
      setSaved(true);
      setTimeout(() => setSaved(false), 1100);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <h2 className="card-title">Reminders & Notifications</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 10 }}>
        <input
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          placeholder="Add new reminder (e.g. Complete goal X)"
        />
        <button type="submit" className="btn btn-outline" style={{ marginLeft: 8 }}>
          Add
        </button>
      </form>
      {saved && (
        <div style={{ color: "var(--primary)", marginBottom: 7 }}>
          Reminder saved!
        </div>
      )}
      <ul style={{ paddingLeft: 12, marginTop: 7, color: "var(--text)" }}>
        {reminders.map((r) => (
          <li key={r.id}>
            <strong>{r.text}</strong> <span style={{ color: "var(--muted)", fontSize: "0.98em" }}>({r.when})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
