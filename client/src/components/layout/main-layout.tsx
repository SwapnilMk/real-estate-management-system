import { Outlet } from "react-router-dom";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { MobileBottomNav } from "./mobile-bottom-nav";

export default function MainLayout() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <MobileBottomNav />
      <SiteFooter />
    </>
  );
}
