import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import SignIn from "@/pages/auth/signin";
import SignUp from "@/pages/auth/signup";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const MainLayout = lazy(() => import("@/components/layout/main-layout"));
const Home = lazy(() => import("@/pages"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ErrorPage = lazy(() => import("@/pages/ErrorPage"));
const AgentDashboard = lazy(() => import("@/pages/agent/dashboard"));
const ClientProfile = lazy(() => import("@/pages/client/profile"));

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        {
          element: <ProtectedRoute allowedRoles={["AGENT"]} />,
          children: [{ path: "/dashboard", element: <AgentDashboard /> }],
        },
        {
          element: <ProtectedRoute />,
          children: [{ path: "/profile", element: <ClientProfile /> }],
        },
      ],
    },
    {
      path: "/sign-in",
      element: <SignIn />,
    },
    {
      path: "/sign-up",
      element: <SignUp />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password/:token",
      element: <ResetPassword />,
    },
    { path: "*", element: <NotFound /> },
  ],
  {
    basename: "/",
  },
);
