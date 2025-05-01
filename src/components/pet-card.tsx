"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PetCardProps } from "@/types"
import { deletePet } from "@/services/PetService"
import { toast, ToastContainer } from "react-toastify"


export function PetCard({ id, name, breed, weight, photo, onDelete }: PetCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()


  const handleEdit = () => {
    // Implementar lógica para editar
    console.log("Editar mascota:", id)
  }

  const handleDelete = async () => {
    const result = await deletePet(id)
      
      if (result?.success) {
        toast.success(result.data.data, {
          autoClose: 2000
        })
        setTimeout(() => {
          if (onDelete) onDelete(id);
        }, 2300);
      }
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
          <img
            src={photo || "/placeholder.svg"}
            alt={name}
            className="object-cover w-full h-full"
          />

          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={handleEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex-col items-start text-sm">
          <p className="text-muted-foreground">{capitalize(breed)}</p>
          <p>Peso: {weight} kg</p> 
        </CardFooter>
      </Card>
      <ToastContainer />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente a {name} de tu lista de mascotas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground bg-red-800 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
