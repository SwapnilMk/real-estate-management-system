"use client";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import {
  MenuIcon,
  Home,
  Map,
  Phone,
  PhoneCall,
  User,
  Search,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/services/authApi";
import type { RootState } from "@/store/store";

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    await logoutMutation().unwrap();
    dispatch(logout());
    setUserMenuOpen(false);
    navigate("/");
  };

  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
        <div className="grid grid-cols-5 h-16">
          {/* Home */}
          <Link
            to="/"
            className={cn(
              "flex flex-col items-center justify-center text-xs",
              isActive("/") ? "text-primary" : "text-gray-500",
            )}
          >
            <Home className="h-5 w-5 mb-1" />
            <span>Home</span>
          </Link>

          {/* Map Search */}
          <Link
            to="/map-search"
            className={cn(
              "flex flex-col items-center justify-center text-xs",
              isActive("/map-search") ? "text-primary" : "text-gray-500",
            )}
          >
            <Map className="h-5 w-5 mb-1" />
            <span>Map</span>
          </Link>

          {/* Contact */}
          <Link
            to="/contact"
            className={cn(
              "flex flex-col items-center justify-center text-xs",
              isActive("/contact") ? "text-primary" : "text-gray-500",
            )}
          >
            <Phone className="h-5 w-5 mb-1" />
            <span>Contact</span>
          </Link>

          {/* LOGIN or USER MENU */}
          {!accessToken ? (
            <Link
              to="/sign-in"
              className="flex flex-col items-center justify-center text-xs text-gray-500"
            >
              <User className="h-5 w-5 mb-1" />
              <span>Login</span>
            </Link>
          ) : (
            <Sheet open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex flex-col items-center justify-center text-xs text-gray-500">
                  <div className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center mb-1 text-sm">
                    {initials}
                  </div>
                  <span>Account</span>
                </button>
              </SheetTrigger>

              <SheetContent side="bottom" className="h-[60vh] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-lg">My Account</SheetTitle>
                </SheetHeader>

                <div className="p-4 space-y-4">
                  <div className="font-semibold">{user?.name}</div>
                  <div className="text-sm text-gray-500 mb-4">
                    {user?.email}
                  </div>

                  {/* Dashboard or Profile */}
                  {user?.role === "AGENT" ? (
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center p-3 border rounded-md hover:bg-muted"
                    >
                      <LayoutDashboard className="h-5 w-5 mr-3" />
                      Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center p-3 border rounded-md hover:bg-muted"
                    >
                      <User className="h-5 w-5 mr-3" />
                      My Profile
                    </button>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center p-3 border rounded-md hover:bg-muted text-red-600"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center text-xs text-gray-500">
                <MenuIcon className="h-5 w-5 mb-1" />
                <span>Menu</span>
              </button>
            </SheetTrigger>

            <SheetContent side="bottom" className="h-[80vh] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-lg">Menu</SheetTitle>
              </SheetHeader>

              <nav className="p-4 overflow-y-auto h-full">
                <ul className="space-y-4">
                  <li className="border-b pb-4">
                    <Link
                      to="/listings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center"
                    >
                      <Search className="h-5 w-5 mr-3" />
                      Listings
                    </Link>
                  </li>

                  <li className="border-b pb-4">
                    <Link
                      to="/map-search"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center"
                    >
                      <Map className="h-5 w-5 mr-3" />
                      Map Search
                    </Link>
                  </li>

                  <li className="border-b pb-4">
                    <Link
                      to="/about"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center"
                    >
                      <span className="h-5 w-5 mr-3 font-semibold">A</span>
                      About
                    </Link>
                  </li>

                  <li className="border-b pb-4">
                    <Link
                      to="/contact"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center"
                    >
                      <PhoneCall className="h-5 w-5 mr-3" />
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="h-16 md:h-0"></div>
    </>
  );
}
