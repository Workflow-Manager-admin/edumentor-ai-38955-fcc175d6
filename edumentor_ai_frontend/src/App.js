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
  ExamPrepDatesProvider,
  useExamPrepDates,
  ExamPrepDatesModal
} from "./features";
import SyllabusAutoImporter from "./features/SyllabusAutoImporter";
import { SyllabusProvider } from "./features/SyllabusContext";
import "./dashboard.css";

/**
 * PUBLIC_INTERFACE
 * Main application container for EduMentor AI dashboard.
 */

// Wraps children to block access if exam not selected or preparation dates not set
function EntranceExamGuard({ children }) {
  const { exam } = useExam();
  // ExamSelectionModal sets selection; modal blocks entire UI
  if (!exam) {
    return <ExamSelectionModal />;
  }
  // After exam chosen, block until dates set
  return <PrepDatesBlocker>{children}</PrepDatesBlocker>;
}

// Helper: provides a modal blocking until both dates are filled, saves to context
function PrepDatesBlocker({ children }) {
  const { startDate, examDate, setExamPrepDates } = useExamPrepDates();
  const [showModal, setShowModal] = React.useState(!(startDate && examDate));

  React.useEffect(() => {
    setShowModal(!(startDate && examDate));
  }, [startDate, examDate]);

  if (showModal) {
    return (
      <ExamPrepDatesModal
        onSave={({ startDate, examDate }) => {
          setExamPrepDates({ startDate, examDate });
          setShowModal(false);
        }}
      />
    );
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
      <ExamPrepDatesProvider>
        <UserProgressProvider>
          <SyllabusProvider>
            <EntranceExamGuard>
              <DashboardLayout
                user={user}
                nav={nav}
                selected={selected}
                onSelect={setSelected}
              >
                <SyllabusAutoImporter />
                <SyllabusManager />
                <StudyPlanner />
                <div>
                  {renderPage()}
                </div>
              </DashboardLayout>
            </EntranceExamGuard>
          </SyllabusProvider>
        </UserProgressProvider>
      </ExamPrepDatesProvider>
    </ExamProvider>
  );
}

export default App;
