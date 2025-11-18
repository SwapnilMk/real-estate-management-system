import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import SignIn from "@/pages/auth/signin";
import SignUp from "@/pages/auth/signup";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";

const MainLayout = lazy(() => import("@/components/layout/main-layout"));
const Home = lazy(() => import("@/pages"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ErrorPage = lazy(() => import("@/pages/ErrorPage"));

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [{ index: true, element: <Home /> }],
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
