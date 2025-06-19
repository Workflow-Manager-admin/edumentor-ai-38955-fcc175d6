import React from "react";
import DashboardLayout from "./components/DashboardLayout";
import { GoalSetting } from "./features/GoalSetting";
import { ProgressTracking } from "./features/ProgressTracking";
import { MentorSelection } from "./features/MentorSelection";
import { MotivationalNudges } from "./features/MotivationalNudges";
import { FeedbackEncouragement } from "./features/FeedbackEncouragement";
import { UserManagement } from "./features/UserManagement";
import { GoalManagement } from "./features/GoalManagement";
import { ProgressUpdates } from "./features/ProgressUpdates";
import { MentorInteraction } from "./features/MentorInteraction";
import { RemindersNotifications } from "./features/RemindersNotifications";
import { AnalyticsReports } from "./features/AnalyticsReports";
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
        return <ProgressTracking />;
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
    <DashboardLayout
      user={user}
      nav={nav}
      selected={selected}
      onSelect={setSelected}
    >
      {renderPage()}
    </DashboardLayout>
  );
}

export default App;
