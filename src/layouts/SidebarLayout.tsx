import { AppSidebar } from "@/components/ui/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import { getAllPetsByUserId } from "@/services/PetService"
import { getUserDataFromLocalStorage } from "@/utils"
import { useEffect, useState } from "react"
import { PetsName } from "@/types"

export default function SidebarLayout() {
  const [userPets, setUserPets] = useState<PetsName>([])
  const userData = getUserDataFromLocalStorage()

  const fetchPets = async () => {
    const result = await getAllPetsByUserId(userData?.id)

    try {
      if (result?.success) {
        // localStorage.setItem('userPets', JSON.stringify(result.data))
        setUserPets(result.data) 
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {fetchPets()}, [])

  return (
    <SidebarProvider>
      <AppSidebar userPets={userPets} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" title="Abrir / cerrar barra lateral" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min py-2">
            <Outlet /> {/* Renderiza el contenido de las páginas */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
