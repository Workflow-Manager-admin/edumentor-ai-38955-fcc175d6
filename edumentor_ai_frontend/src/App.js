import React from "react";
import DashboardLayout from "./components/DashboardLayout";
import {
  GoalSetting,
  ProgressTracking,
  MentorSelection,
  MotivationalNudges,
  FeedbackEncouragement,
  UserManagement,
  GoalManagement,
  ProgressUpdates,
  MentorInteraction,
  RemindersNotifications,
  AnalyticsReports,
  FocusMode,
  ProgressMap,
  MoodTracker
} from "./features";
import { SyllabusProvider } from "./features/SyllabusContext";
import { SyllabusManager } from "./features/SyllabusManager";
import { UserProgressProvider } from "./features/UserProgressContext";
import "./dashboard.css";

/**
 * PUBLIC_INTERFACE
 * Main application container for EduMentor AI dashboard.
 */
function App() {
  const [selected, setSelected] = React.useState("progress-tracking");
  // Demo user
  const user = { name: "Alex Rivera", initial: "A" };

  const nav = [
    { key: "progress-tracking", label: "Progress", icon: "📊" },
    { key: "focus-mode", label: "Focus Mode", icon: "⏳" },
    { key: "progress-map", label: "Progress Map", icon: "🗺️" },
    { key: "mood-tracker", label: "Mood Tracker", icon: "😊" },
    { key: "goals", label: "Goals", icon: "🎯" },
    { key: "mentor", label: "Mentor", icon: "🤝" },
    { key: "nudges", label: "Nudges", icon: "💡" },
    { key: "feedback", label: "Feedback", icon: "✉️" },
    { key: "reminders", label: "Reminders", icon: "⏰" },
    { key: "analytics", label: "Analytics", icon: "📈" },
    { key: "account", label: "Account", icon: "👤" }
  ];

  const renderPage = () => {
    switch (selected) {
      case "progress-tracking":
        return (
          <>
            <ProgressTracking />
            <ProgressUpdates />
          </>
        );
      case "focus-mode":
        return <FocusMode />;
      case "progress-map":
        return <ProgressMap />;
      case "mood-tracker":
        return <MoodTracker />;
      case "goals":
        return (
          <>
            <GoalSetting />
            <GoalManagement />
          </>
        );
      case "mentor":
        return (
          <>
            <MentorSelection />
            <MentorInteraction />
          </>
        );
      case "nudges":
        return <MotivationalNudges />;
      case "feedback":
        return <FeedbackEncouragement />;
      case "reminders":
        return <RemindersNotifications />;
      case "analytics":
        return <AnalyticsReports />;
      case "account":
        return <UserManagement />;
      default:
        return <ProgressTracking />;
    }
  };

  return (
    <UserProgressProvider>
      <SyllabusProvider>
        <DashboardLayout
          user={user}
          nav={nav}
          selected={selected}
          onSelect={setSelected}
        >
          <SyllabusManager />
          <div>
            {renderPage()}
          </div>
        </DashboardLayout>
      </SyllabusProvider>
    </UserProgressProvider>
  );
}

export default App;
