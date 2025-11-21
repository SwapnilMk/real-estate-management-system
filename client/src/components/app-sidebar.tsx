import * as React from "react";
import {
  IconHome,
  IconBuilding,
  IconMessageCircle,
  IconUsers,
  IconAddressBook,
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
import { Link } from "react-router-dom";

import { useGetDashboardStatsQuery } from "@/services/agentApi";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: stats } = useGetDashboardStatsQuery();

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      title: "My Listings",
      url: "/dashboard/listings",
      icon: IconBuilding,
      badge: stats?.totalProperties
        ? stats.totalProperties.toString()
        : undefined,
    },

    {
      title: "Inquiries",
      url: "/dashboard/inquiries",
      icon: IconMessageCircle,
      badge: stats?.pendingInterests
        ? stats.pendingInterests.toString()
        : undefined,
    },
    {
      title: "Contacts",
      url: "/dashboard/contacts",
      icon: IconAddressBook,
    },
    {
      title: "Clients",
      url: "/dashboard/clients",
      icon: IconUsers,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ---------- HEADER ---------- */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconBuilding className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Real Estate</span>
                  <span className="truncate text-xs">Agent Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
