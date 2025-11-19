import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export function useAuth() {
    const { user, accessToken } = useSelector((state: RootState) => state.auth);
    return {
        isAuthenticated: !!accessToken,
        user,
        isClient: user?.role === "CLIENT",
        isAgent: user?.role === "AGENT",
    };
}