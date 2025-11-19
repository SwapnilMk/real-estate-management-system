import * as React from "react";
import {
  IconHome,
  IconBuilding,
  IconHeart,
  IconMessageCircle,
  IconMapPin,
  IconSettings,
  IconBell,
  IconUsers,
  IconChartBar,
  IconPlus,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      title: "My Listings",
      url: "/dashboard/listings",
      icon: IconBuilding,
      badge: "12",
    },
    {
      title: "Add New Property",
      url: "/dashboard/listings/new",
      icon: IconPlus,
    },
    {
      title: "Favorites",
      url: "/dashboard/favorites",
      icon: IconHeart,
    },
    {
      title: "Inbox & Leads",
      url: "/dashboard/inbox",
      icon: IconMessageCircle,
      badge: "8",
    },
    {
      title: "My Clients",
      url: "/dashboard/clients",
      icon: IconUsers,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      title: "Saved Searches",
      url: "/dashboard/searches",
      icon: IconMapPin,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: IconBell,
      badge: "3",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ---------- HEADER ---------- */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <a href="/dashboard" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconBuilding className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Real Estate</span>
                  <span className="truncate text-xs">Agent Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
