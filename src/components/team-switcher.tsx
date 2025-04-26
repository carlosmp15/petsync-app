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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


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
  const [openDialog, setOpenDialog] = useState(false);


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

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Nueva Mascota</DialogTitle>
                  <DialogDescription>
                    Ingresa los datos de tu nueva mascota aquí.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" placeholder="Nombre de la mascota" />
                  </div>

                  {/* Raza */}
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="breed">Raza</Label>
                    <Input id="breed" placeholder="Raza de la mascota (ej: Labrador)" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="gender">Género</Label>
                    <Select name="gender">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el género" />
                      </SelectTrigger>
                      <SelectContent> 
                        <SelectItem value="male">Macho</SelectItem>
                        <SelectItem value="female">Hembra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Peso en kilogramos"
                      min="1"
                      max="90"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="birthday">Fecha de Nacimiento</Label>
                    <Input id="birthday" type="date" />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" onClick={() => setOpenDialog(false)}>
                    Guardar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
