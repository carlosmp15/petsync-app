"use client";

import * as React from "react";
import {
  Frame,
  Map,
  PieChart,
  Beef,
  SquareActivity,
  BriefcaseMedical,
  PawPrint,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUserStore } from "@/stores/userStore"
import { getUserDataFromLocalStorage } from "@/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userData = getUserDataFromLocalStorage()

  // This is sample data.
  const data = {
    user: {
      name: userData?.name,
      email: userData?.email,
      avatar: "https://github.com/shadcn.png",
    },
    teams: [
      {
        name: "Toby",
        logo: PawPrint,
      },
      {
        name: "Kira",
        logo: PawPrint,
      },
    ],
    navMain: [
      {
        title: "Alimentación",
        url: "#",
        icon: Beef,
        items: [
          {
            title: "Gestionar alimentación",
            url: "/pet/feedings",
          },
        ],
      },
      {
        title: "Actividades Diarias",
        url: "#",
        icon: SquareActivity,
        items: [
          {
            title: "Gestionar act. diarias",
            url: "/pet/daily-activities",
          },
        ],
      },
      {
        title: "Historiales Médicos",
        url: "#",
        icon: BriefcaseMedical,
        items: [
          {
            title: "Gestionar hist. médicos",
            url: "/pet/medical-histories",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
