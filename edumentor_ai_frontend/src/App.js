import React from "react";
import DashboardLayout from "./components/DashboardLayout";
import {
  GoalSetting,
  ProgressTracking,
  ProgressMap,
  SyllabusContext,
  SyllabusManager,
  UserProgressProvider
} from "./features";
import { SyllabusProvider } from "./features/SyllabusContext";
import "./dashboard.css";

/**
 * PUBLIC_INTERFACE
 * Main application container for EduMentor AI dashboard.
 */
function App() {
  const [selected, setSelected] = React.useState("progress-tracking");
  // Demo user
  const user = { name: "Alex Rivera", initial: "A" };

  // Only keep navigation links for real user-data-driven features:
  const nav = [
    { key: "progress-tracking", label: "Progress", icon: "📊" },
    { key: "progress-map", label: "Progress Map", icon: "🗺️" }
  ];

  const renderPage = () => {
    switch (selected) {
      case "progress-tracking":
        return <ProgressTracking />;
      case "progress-map":
        return <ProgressMap />;
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
