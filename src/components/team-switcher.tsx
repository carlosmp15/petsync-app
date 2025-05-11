"use client"

import { ChevronsUpDown, PawPrint, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { createNewPet } from "@/services/PetService"
import { usePetStore } from "@/stores/petStore"
import { toast, ToastContainer } from "react-toastify"
import { format } from "date-fns"
import { getUserDataFromLocalStorage } from "@/utils"
import { useNavigate } from "react-router-dom"
import { PetFormDialog } from "./PetFormDialog"


export function TeamSwitcher({
  teams,
}: {
  teams: {
    id: number,
    name: string
    logo: React.ElementType
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = useState(teams.length > 0 ? teams[0] : null)
  const [openDialog, setOpenDialog] = useState(false)
  const userData = getUserDataFromLocalStorage()
  const navigate = useNavigate()
  const {
    name, setName,
    breed, setBreed,
    gender, setGender,
    weight, setWeight,
    birthday, setBirthday,
    photo, setPhoto,
    resetPet
  } = usePetStore()

  const handleSubmit = async () => {

    if (!name || !breed || !gender || !weight || !birthday) {
      toast.error("Todos los campos son obligatorios.")
      return
    }

    try {
      const result = await createNewPet(userData?.id, name, breed, gender, weight, format(birthday, 'yyyy-MM-dd'), photo)

      if (result?.success) {
        resetPet()
      
        toast.success(result.message, {
          autoClose: 2000,
        })
      
        setTimeout(() => {
          navigate(0)
        }, 2300)
      } else {
        toast.error(result?.message)
      }
    } catch (error) {
      console.error("Error en handleUpdate:", error)
    }
  }

  useEffect(() => {
    const storedPet = localStorage.getItem('selectedPet')
    
    if (storedPet) {
      const pet = JSON.parse(storedPet)
      const selectedTeam = teams.find(team => team.id === pet.id)
      if (selectedTeam) {
        setActiveTeam(selectedTeam)
      } else {
        setActiveTeam(teams[0]) // si no encuentra la mascota selecciona el 1º
      }
    } else {
      if (teams.length > 0) {
        setActiveTeam(teams[0])
      } else {
        setActiveTeam(null)
      }
    }
  }, [teams])


  return (
    <SidebarMenu>
      <ToastContainer />
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeTeam ? (
                  <activeTeam.logo className="size-4" />
                ) : (
                  <PawPrint className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam ? activeTeam.name : "Sin mascotas"}
                </span>
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
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Mis Mascotas
            </DropdownMenuLabel>

            {teams.length > 0 ? (
              teams.map((team) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => {
                    setActiveTeam(team)
                    localStorage.setItem('selectedPet', JSON.stringify({ id: team.id, name: team.name }))
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
              <div className="p-2 text-sm text-muted-foreground">
                No tienes mascotas aún.
              </div>
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

            { /* Formulario nueva mascota */ }
            <PetFormDialog
              open={openDialog}
              onOpenChange={(open) => {
                setOpenDialog(open)
                if (!open) {
                  resetPet()
                  setPhoto("")
                }
              }}
              onSubmit={async () => {
              await handleSubmit()
              setOpenDialog(false)
            }}

              title="Nueva Mascota"
              description="Ingresa los datos de tu nueva mascota aquí."
              name={name}
              setName={setName}
              breed={breed}
              setBreed={setBreed}
              gender={gender}
              setGender={setGender}
              weight={weight}
              setWeight={setWeight}
              birthday={birthday}
              setBirthday={setBirthday}
              photo={photo}
              setPhoto={setPhoto}
            />


          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
