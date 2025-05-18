import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PetCardProps } from "@/types"
import { deletePet, updatePetData } from "@/services/PetService"
import { toast } from "react-toastify"
import { PetFormDialog } from "./PetFormDialog"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"

export function PetCard({ id, name, breed, gender, weight, birthday, photo, onDelete }: PetCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const navigate = useNavigate()

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

  const handleEdit = () => {
    setShowUpdateDialog(true)
  }

  const handleUpdateSubmit = async (data: any, newPhoto: string) => {
    try {
      const result = await updatePetData(
        id,
        data.name,
        data.breed,
        data.gender,
        data.weight,
        format(data.birthday, 'yyyy-MM-dd'),
        newPhoto
      )

      if (result?.success) {
        toast.success(result.message as string, {
          autoClose: 2000,
          onClose: () => {
            navigate(0)
          }
        })
        setShowUpdateDialog(false)
      } else {
        toast.error(result.message as string, {
          autoClose: 2000,})
      }
    } catch (err) {
      console.error(err)
      toast.error("Error actualizando la mascota.")
    }
  }

  const handleDelete = async () => {
    const result = await deletePet(id)

    if (result?.success) {
      toast.success(result.data.data, {
        autoClose: 2000,
        onClose: () => {
          navigate(0)
        }
      })
      if (onDelete) onDelete(id)
    } else {
      toast.error("Error al eliminar.", {
        autoClose: 2000
      })
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
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
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

      <PetFormDialog
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        onSubmit={handleUpdateSubmit}
        defaultValues={{
          name,
          breed,
          gender,
          weight,
          birthday: birthday ? new Date(birthday) : undefined,  // asegúrate que sea Date
        }}
        defaultPhoto={photo}
      />


      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente a {name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-800 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
