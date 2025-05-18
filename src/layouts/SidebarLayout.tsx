import { AppSidebar } from "@/components/ui/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import { getAllPetsNameByUserId } from "@/services/PetService"
import { decryptData, getUserDataFromLocalStorage } from "@/utils"
import { useEffect } from "react"
import { usePetUserStore } from "@/stores/petUserStore"
import { ToastContainer } from "react-toastify"


export default function SidebarLayout() {
  const { pets, setPets } = usePetUserStore()
  const userData = getUserDataFromLocalStorage()

  
  const fetchPets = async () => {
    const result = await getAllPetsNameByUserId(userData?.id)
    try {
      if (result?.success) {
        setPets(result.data) 
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {fetchPets()}, [])

  return (
  <SidebarProvider>
    <AppSidebar userPets={pets} />
    <SidebarInset>
      <header className="...">
        {/* header content */}
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min py-2">
          <Outlet />
        </div>
      </div>
    </SidebarInset>

    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </SidebarProvider>
)

}
