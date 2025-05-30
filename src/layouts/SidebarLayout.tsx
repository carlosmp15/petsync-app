import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { getAllPetsNameByUserId } from "@/services/PetService";
import { getUserDataFromLocalStorage } from "@/utils";
import { useEffect } from "react";
import { usePetUserStore } from "@/stores/petUserStore";
import { ToastContainer } from "react-toastify";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function SidebarLayout() {
  const { pets, setPets } = usePetUserStore();
  const userData = getUserDataFromLocalStorage();

  const fetchPets = async () => {
    const result = await getAllPetsNameByUserId(userData?.id);
    try {
      if (result?.success) {
        setPets(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar userPets={pets} />
      <SidebarInset>
        {/* Header con trigger para móvil */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          {/* Mostrar trigger solo en móviles */}
          <SidebarTrigger className="-ml-1">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
          </SidebarTrigger>

          <Separator orientation="vertical" className="mr-2 h-4" />

          <div className="flex flex-1 items-center gap-2">
            <NavLink to={"/"} className="flex items-center gap-2" end>
              <h1 className="text-lg font-semibold">PetSync</h1>
            </NavLink>
          </div>
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
  );
}
