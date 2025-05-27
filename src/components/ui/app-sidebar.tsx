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
import { getUserDataFromLocalStorage } from "@/utils"
import { useUserUpdateStore } from "@/stores/userUpdated"
import { useEffect, useState } from "react"

export function AppSidebar({ userPets = [], ...props }: { userPets: any[], [key: string]: any }) {
  const userData = getUserDataFromLocalStorage()
  const { needsUpdate, setNeedsUpdate } = useUserUpdateStore()
  const [renderKey, setRenderKey] = useState(0) // para forzar re-render

  useEffect(() => {
    if (needsUpdate) {
      setRenderKey(prev => prev + 1)
      setNeedsUpdate(false)
    }
  }, [needsUpdate, setNeedsUpdate])

  const data = {
    user: {
      name: userData?.name,
      email: userData?.email,
      avatar: "https://github.com/shadcn.png",
    },
    teams: userPets?.map((pet: { id: number; name: string }) => ({
      id: pet.id,
      name: pet.name,
      logo: PawPrint,
    })) ?? [],
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
    <Sidebar key={renderKey} collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher key={renderKey} teams={data.teams} />
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
