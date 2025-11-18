"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

import {
  MenuIcon,
  Home,
  Search,
  User,
  Phone,
  PhoneCall,
  Map,
  MapPinHouse,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function MobileBottomNav() {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

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

          {/* Login */}
          <Link
            to="/sign-in"
            className="flex flex-col items-center justify-center text-xs text-gray-500"
          >
            <User className="h-5 w-5 mb-1" />
            <span>Login</span>
          </Link>

          {/* Menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center text-xs text-gray-500">
                <MenuIcon className="h-5 w-5 mb-1" />
                <span>Menu</span>
              </button>
            </SheetTrigger>

            {/* Menu Sheet */}
            <SheetContent side="bottom" className="h-[80vh] p-0">
              <SheetHeader className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <SheetTitle className="text-lg font-semibold">
                    Menu
                  </SheetTitle>
                </div>
              </SheetHeader>

              <nav className="p-4 overflow-y-auto h-full">
                <ul className="space-y-4">
                  {/* Listings */}
                  <li className="border-b pb-4">
                    <Link
                      to="/listings"
                      className="flex items-center justify-between"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Search className="h-5 w-5 mr-3" />
                        <span>Listings</span>
                      </div>
                    </Link>
                  </li>

                  {/* Map Search */}
                  <li className="border-b pb-4">
                    <Link
                      to="/map-search"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Map className="h-5 w-5 mr-3" />
                        <span>Map Search</span>
                      </div>
                    </Link>
                  </li>

                  {/* Our Listings */}
                  <li className="border-b pb-4">
                    <Link
                      to="/our-listings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <MapPinHouse className="h-5 w-5 mr-3" />
                        <span>Our Listings</span>
                      </div>
                    </Link>
                  </li>

                  {/* Blog */}
                  <li className="border-b pb-4">
                    <Link
                      to="/blog"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <span className="h-5 w-5 mr-3 font-semibold">B</span>
                        <span>Blog</span>
                      </div>
                    </Link>
                  </li>

                  {/* About */}
                  <li className="border-b pb-4">
                    <Link
                      to="/about"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <span className="h-5 w-5 mr-3 font-semibold">A</span>
                        <span>About</span>
                      </div>
                    </Link>
                  </li>

                  {/* Contact */}
                  <li className="border-b pb-4">
                    <Link
                      to="/contact"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <PhoneCall className="h-5 w-5 mr-3" />
                        <span>Contact</span>
                      </div>
                    </Link>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Page Bottom Padding */}
      <div className="h-16 md:h-0"></div>
    </>
  );
}
