"use client"

import type React from "react"

import { ChevronsUpDown, PawPrint, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { createNewPet } from "@/services/PetService"
import { useSelectedPetStore } from "@/stores/selectedPetStore"
import { toast } from "react-toastify"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { PetFormDialog } from "./PetFormDialog"
import { getUserDataFromLocalStorage } from "@/utils"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    id: number
    name: string
    logo: React.ElementType
  }[]
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  const [openDialog, setOpenDialog] = useState(false)

  const { id, setSelectedPet, resetSelectedPet } = useSelectedPetStore()
  const userData = getUserDataFromLocalStorage()
  const navigate = useNavigate()

  useEffect(() => {
    if (teams.length > 0) {
      const selectedTeam = teams.find((team) => team.id === id)

      if (!selectedTeam) {
        setSelectedPet({ id: teams[0].id, name: teams[0].name })
      }
    } else {
      resetSelectedPet()
    }
  }, [teams, id, setSelectedPet, resetSelectedPet])

  const activeTeam = teams.find((team) => team.id === id) || null

  const handleSubmitNewPet = async (data: any, photo: string) => {
    try {
      const result = await createNewPet(
        userData?.id,
        data.name,
        data.breed,
        data.gender,
        data.weight,
        format(data.birthday, "yyyy-MM-dd"),
        photo,
      )

      if (result?.success) {
        toast.success(result.message, { autoClose: 2000 })
        setOpenDialog(false)

        setTimeout(() => {
          window.location.reload()
        }, 2300)
      } else {
        toast.error(result?.message || "Error al crear la mascota.")
      }
    } catch (error) {
      console.error("Error creando mascota:", error)
      toast.error("Hubo un error al guardar la mascota.")
    }
  }

  const handleTeamSelect = (teamId: number, teamName: string) => {
    setSelectedPet({ id: teamId, name: teamName })

    // Close sidebar on mobile when a team is selected
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeTeam ? <activeTeam.logo className="size-4" /> : <PawPrint className="size-4" />}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeTeam ? activeTeam.name : "Sin mascotas"}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Mis Mascotas</DropdownMenuLabel>

            {teams.length > 0 ? (
              teams.map((team) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => {
                    handleTeamSelect(team.id, team.name)
                  }}
                  className="gap-2 p-2 cursor-pointer"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <team.logo className="size-4 shrink-0" />
                  </div>
                  {team.name}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground">No tienes mascotas aún.</div>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-2 p-2 cursor-pointer"
              onSelect={(e) => {
                e.preventDefault()
                setOpenDialog(true)
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Nueva mascota</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <PetFormDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          onSubmit={handleSubmitNewPet}
          defaultPhoto={""}
          isEdit={false}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
