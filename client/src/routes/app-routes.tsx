import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import SignIn from "@/pages/auth/signin";
import SignUp from "@/pages/auth/signup";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import About from "@/pages/client/about";
import Contact from "@/pages/client/contact";
import ListingsPage from "@/pages/client/listing";
import PropertyDetailPage from "@/pages/client/property-detail";
import OurListingsPage from "@/pages/client/our-listings";
import MapSearchPage from "@/pages/client/map-search";
import DashboardPage from "@/pages/agent/dashboard/dashboard";
import MyProperties from "@/pages/agent/listing/listing";
import UserList from "@/pages/agent/user/user-list";
import InterestList from "@/pages/agent/user/interest-list";
import FavoritesPage from "@/pages/agent/favorites/favorites";
import DashboardLayout from "@/components/layout/dashboard-layout";

const MainLayout = lazy(() => import("@/components/layout/main-layout"));
const Home = lazy(() => import("@/pages"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ErrorPage = lazy(() => import("@/pages/ErrorPage"));
const ClientProfile = lazy(() => import("@/pages/client/profile"));

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        { path: "/about", element: <About /> },
        { path: "/contact", element: <Contact /> },
        { path: "/listings", element: <ListingsPage /> },
        { path: "/our-listings", element: <OurListingsPage /> },
        { path: "/listings/:id", element: <PropertyDetailPage /> },
        { path: "/map-search", element: <MapSearchPage /> },
        {
          element: <ProtectedRoute />,
          children: [{ path: "/profile", element: <ClientProfile /> }],
        },
      ],
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          element: <ProtectedRoute allowedRoles={["AGENT"]} />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: "listings", element: <MyProperties /> },
            { path: "favorites", element: <FavoritesPage /> },
            { path: "clients", element: <UserList /> },
            { path: "inquiries", element: <InterestList /> },
          ],
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
