import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

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
    { path: "*", element: <NotFound /> },
  ],
  {
    basename: "/",
  },
);
