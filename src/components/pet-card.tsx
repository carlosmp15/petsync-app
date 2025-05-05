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
import { deletePet, updatePetData } from "@/services/PetService"
import { toast, ToastContainer } from "react-toastify"
import { PetFormDialog } from "./PetFormDialog"
import { usePetStore } from "@/stores/petStore"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"


export function PetCard({ id, name, breed, gender, weight, birthday, photo, onDelete }: PetCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const navigate = useNavigate()

  const {
    name: petName,
    breed: petBreed,
    gender: petGender,
    weight: petWeight,
    birthday: petBirthday,
    photo: petPhoto,
    setName,
    setBreed,
    setGender,
    setWeight,
    setBirthday,
    setPhoto,
    resetPet,
  } = usePetStore()
  

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

  const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault()
  
      if (!petName || !petBreed || !petGender || !petWeight || !petBirthday) {
        toast.error("Todos los campos son obligatorios.")
        return
      }

  
      try {
        const result = await updatePetData(id, petName, petBreed, petGender, petWeight, format(petBirthday, 'yyyy-MM-dd'), petPhoto)
  
        if (result?.success) {
          setShowUpdateDialog(false)
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

  const handleEdit = () => {
    setName(name)
    setBreed(breed)
    setGender(gender)
    setWeight(weight)
    setBirthday((birthday))
    setPhoto(photo)

    setShowUpdateDialog(true)
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

      <PetFormDialog
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        onSubmit={handleSubmit}
        title="Editar Mascota"
        description="Modifica los datos de tu mascota."
        name={petName}
        setName={setName}
        breed={petBreed}
        setBreed={setBreed}
        gender={petGender}
        setGender={setGender}
        weight={petWeight}
        setWeight={setWeight}
        birthday={petBirthday}
        setBirthday={setBirthday}
        photo={petPhoto}
        setPhoto={setPhoto}
      />

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
