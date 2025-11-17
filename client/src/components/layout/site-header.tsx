"use client";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b shadow-sm">
      {/* padding for mobile left & right */}
      <div className="max-w-7xl mx-auto px-4 flex h-16 items-center justify-between">
        {/* Mobile: center logo only */}
        <div className="flex flex-1 md:flex-none justify-center md:justify-start">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">REAL ESTATE</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link
            to="/map-search"
            className="text-sm font-medium hover:text-primary"
          >
            Map Search
          </Link>
          <Link
            to="/listings"
            className="text-sm font-medium hover:text-primary"
          >
            Listings
          </Link>
          <Link
            to="/our-listings"
            className="text-sm font-medium hover:text-primary"
          >
            Our Listings
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium hover:text-primary"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Sign-In Button */}
        <div className="hidden md:flex">
          <Link to="/login">
            <Button className="bg-black text-white" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
