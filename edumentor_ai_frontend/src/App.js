import React from "react";
import DashboardLayout from "./components/DashboardLayout";
import {
  GoalSetting,
  ProgressTracking,
  ProgressMap,
  SyllabusContext,
  SyllabusManager,
  UserProgressProvider,
  ExamProvider,
  useExam,
  ExamSelectionModal,
  StudyPlanner,
} from "./features";
import { SyllabusProvider } from "./features/SyllabusContext";
import "./dashboard.css";

/**
 * PUBLIC_INTERFACE
 * Main application container for EduMentor AI dashboard.
 */

// Wraps children to block access if exam not selected
function EntranceExamGuard({ children }) {
  const { exam } = useExam();
  // ExamSelectionModal sets selection; modal blocks entire UI
  if (!exam) {
    return <ExamSelectionModal />;
  }
  return children;
}

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
    <ExamProvider>
      <UserProgressProvider>
        <SyllabusProvider>
          <EntranceExamGuard>
            <DashboardLayout
              user={user}
              nav={nav}
              selected={selected}
              onSelect={setSelected}
            >
              <SyllabusManager />
              <StudyPlanner />
              <div>
                {renderPage()}
              </div>
            </DashboardLayout>
          </EntranceExamGuard>
        </SyllabusProvider>
      </UserProgressProvider>
    </ExamProvider>
  );
}

export default App;
