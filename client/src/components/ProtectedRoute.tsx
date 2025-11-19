import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles?: ("CLIENT" | "AGENT")[];
}

export function ProtectedRoute({ allowedRoles }: Props) {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);

  if (!accessToken || !user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
