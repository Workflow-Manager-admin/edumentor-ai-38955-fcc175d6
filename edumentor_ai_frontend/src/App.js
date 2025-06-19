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
  // New features
  FocusMode,
  ProgressMap,
  MoodTracker,
  CareerVisualizer,
  RewardsSystem,
  DailyRecap,
  ManualStudyPlanner,
  RulesBasedCoach,
  LocalLeaderboard,
  QuickRevisionPlan,
  DemoBuddy,
  StaticQnAChatbot
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
    { key: "career-visualizer", label: "Career Path", icon: "🧭" },
    { key: "rewards", label: "Rewards", icon: "🏅" },
    { key: "daily-recap", label: "Daily Recap", icon: "📝" },
    { key: "goals", label: "Goals", icon: "🎯" },
    { key: "manual-study-planner", label: "Study Planner (Manual)", icon: "🗒️" },
    { key: "quick-revision", label: "Boost/Revision", icon: "⚡", demo: true },
    { key: "mentor", label: "Mentor", icon: "🤝" },
    { key: "rules-coach", label: "Coach (Demo)", icon: "💬", demo: true },
    { key: "leaderboard", label: "Leaderboard (Local)", icon: "🏆", demo: true },
    { key: "buddy", label: "Buddy (Demo)", icon: "👬", demo: true },
    { key: "qna", label: "Q&A (Static)", icon: "❓", demo: true },
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
      case "career-visualizer":
        return <CareerVisualizer />;
      case "rewards":
        return <RewardsSystem />;
      case "daily-recap":
        return <DailyRecap />;
      case "goals":
        return (
          <>
            <GoalSetting />
            <GoalManagement />
          </>
        );
      case "manual-study-planner":
        return <ManualStudyPlanner />;
      case "quick-revision":
        return <QuickRevisionPlan />;
      case "mentor":
        return (
          <>
            <MentorSelection />
            <MentorInteraction />
          </>
        );
      case "rules-coach":
        return <RulesBasedCoach />;
      case "leaderboard":
        return <LocalLeaderboard />;
      case "buddy":
        return <DemoBuddy />;
      case "qna":
        return <StaticQnAChatbot />;
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
            {(nav.find((n) => n.key === selected && n.demo)) && (
              <div style={{
                color: "#ED8510",
                background: "#fffbe3",
                padding: "7px 12px",
                borderRadius: 7,
                fontWeight: 600,
                fontSize: "1.04em",
                marginBottom: 16,
                display: "inline-block"
              }}>
                <span style={{ fontSize: "1.08em", marginRight: 7 }}>⚠️</span>
                Demo/Alternative Version: This feature is a static or simulated alternative to a backend/AI-powered version.
              </div>
            )}
            {renderPage()}
          </div>
        </DashboardLayout>
      </SyllabusProvider>
    </UserProgressProvider>
  );
}

export default App;
