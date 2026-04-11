import React, { Suspense } from "react";
import { useAuth } from "../../context/AuthContext";
import ContactAndFeedback from "../../components/shared/ContactAndFeedback";

const ResearcherDashboard = React.lazy(() => import("./ResearcherDashboard"));
const ReviewerDashboard = React.lazy(() => import("./ReviewerDashboard"));
const AdminDashboard = React.lazy(() => import("./AdminDashboard"));
const ScrutinyDashboard = React.lazy(() => import("./ScrutinyDashboard"));

export default function Dashboard() {
  const { user } = useAuth();

  const renderDashboard = () => {
    console.log("Rendering dashboard for role:", user?.role);
    switch (user?.role) {
      case "researcher":
        return <ResearcherDashboard />;

      case "reviewer":
        return <ReviewerDashboard />;

      case "admin":
        return <AdminDashboard />;

      case "scrutiny":
        return <ScrutinyDashboard />;

      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-slate-800">
              Dashboard
            </h1>
            <p className="text-slate-600 mt-2">
              Welcome{user?.name ? `, ${user.name}` : ""}.
            </p>
          </div>
        );
    }
  };

  return (
    <Suspense
      fallback={
        <div className="p-6 text-slate-600">
          Loading dashboard…
        </div>
      }
    >
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          {renderDashboard()}
        </div>
        <ContactAndFeedback />
      </div>
    </Suspense>
  );
}