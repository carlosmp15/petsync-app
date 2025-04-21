"use client"

import * as React from "react"
import {
  Frame,
  Map,
  PieChart,
  Beef,
  SquareActivity,
  BriefcaseMedical,
  PawPrint
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

// This is sample data.
const data = {
  user: {
    name: "Carlos",
    email: "carlos@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Toby",
      logo: PawPrint,
    },
    {
      name: "Kira",
      logo: PawPrint,
    }
  ],
  navMain: [
    {
      title: "Alimentación",
      url: "#",
      icon: Beef,
      items: [
        {
          title: "Gestionar alimentación",
          url: "#",
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
          url: "#",
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
          url: "#",
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
