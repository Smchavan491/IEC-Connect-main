import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import AppLayout from "../components/layout/AppLayout";
import WebsiteLayout from "../components/layout/WebsiteLayout";
import Login from "../feature/auth/Login";
import Home from "../feature/home/Home";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../feature/dashboard/Dashboard";
import Documents from "../feature/documents/Documents";
import Register from "../feature/auth/Register";
import ForgotPassword from "../feature/auth/ForgotPassword";
import ResetPassword from "../feature/auth/ResetPassword";
import DocumentDetail from "@/feature/documents/DocumentDetail";
import ProposalWizard from "@/feature/proposals/ProposalWizard";
import { useAuth } from "../context/AuthContext";

// Website (public informational) pages
import WebsiteHome from "../feature/website/WebsiteHome";
import AboutIEC from "../feature/website/AboutIEC";
import SubmissionGuidelines from "../feature/website/SubmissionGuidelines";
import RequiredDocuments from "../feature/website/RequiredDocuments";
import Announcements from "../feature/website/Announcements";
import Contact from "../feature/website/Contact";

/** Redirect authenticated staff/admin away from the public home to their dashboard. */
function RootRedirect() {
  const { user, status } = useAuth();

  if (status === "loading") return null;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <WebsiteHome />;
}


const router = createBrowserRouter([
  /* ── Public Website (informational, no auth required) ── */
  {
    element: <WebsiteLayout />,
    children: [
      { path: "/",                    element: <RootRedirect /> },
      { path: "/about",               element: <AboutIEC /> },
      { path: "/guidelines",          element: <SubmissionGuidelines /> },
      { path: "/documents-required",  element: <RequiredDocuments /> },
      { path: "/announcements",       element: <Announcements /> },
      { path: "/contact",             element: <Contact /> },
    ],
  },

  /* ── Auth pages (login, register, etc.) ── */
  {
    element: <PublicLayout />,
    children: [
      { path: "/login",                    element: <Login /> },
      { path: "/register",                 element: <Register /> },
      { path: "/forgot-password",          element: <ForgotPassword /> },
      { path: "/reset-password/:token",    element: <ResetPassword /> },
    ],
  },

  /* ── Protected App (requires login) ── */
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard",            element: <Dashboard /> },
          { path: "/documents",            element: <Documents /> },
          { path: "/proposals/new",        element: <ProposalWizard /> },
          { path: "/proposals/:id/edit",   element: <ProposalWizard /> },
          { path: "/proposals/:id",        element: <DocumentDetail /> },
          { path: "/documents/:id",        element: <DocumentDetail /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
