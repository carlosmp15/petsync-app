import { createNewMedicalHistory, deleteMedicalHistory, getAllMedicalHistoryByPetId, updateMedicalHistory } from "@/services/MedicalHistoryService"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MedicalHistoryProps } from "@/types"
import { toast } from "react-toastify"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DatePicker } from "@/components/ui/date-picker"
import { useSelectedPetStore } from "@/stores/selectedPetStore"


const medicalTypes = ["Vacunación", "Consulta general", "Cirugía", "Desparasitación", "Análisis", "Tratamiento", "Otro"]

export default function ManageMedicalHistoriesPage() {
  const [medicalHistories, setMedicalHistories] = useState<MedicalHistoryProps[]>([])
  const [selectedToDelete, setSelectedToDelete] = useState<number | null>(null)
  const { id, name } = useSelectedPetStore()

  const fetchMedicalHistories = async () => {
    try {
      const result = await getAllMedicalHistoryByPetId(id)

      if (result?.success) {
        setMedicalHistories(result.data)
      } else {
        setMedicalHistories([])
      }
    } catch (error) {
      setMedicalHistories([])
    }
  }


  useEffect(() => {
    fetchMedicalHistories()
  }, [])

  useEffect(() => {
    if (id !== undefined) {
      fetchMedicalHistories()
    }
  }, [id])

  // Estado para el formulario
  const [isOpen, setIsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<MedicalHistoryProps>({
    id: 0,
    type: "",
    description: "",
    date: new Date(),
  })

  // Función para abrir el formulario en modo añadir
  const handleAddNew = () => {
    setIsEditMode(false)
    setCurrentRecord({
      id: 0,
      type: "",
      description: "",
      date: new Date(),
    })
    setIsOpen(true)
  }

  const handleEdit = (ms: MedicalHistoryProps) => {
    setIsEditMode(true)
    setCurrentRecord({ ...ms })
    setIsOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteMedicalHistory(id)
      if(result?.success) {
        setMedicalHistories(medicalHistories.filter((ms) => ms.id !== id))
        toast.success("Historial médico eliminado correctamente", {
          autoClose: 2000
        })
      }
    } catch (error) {
      toast.error("Error inesperado al eliminar un historial médico.")
    }
  }

  const handleSave = async () => {
    if (!currentRecord.type || !currentRecord.description) {
      toast.error("Todos los campos son obligatorios.", {
        autoClose: 2000,
      })
      return
    }

    try {
      if (isEditMode) {
        const result = await updateMedicalHistory(
          currentRecord.id,
          currentRecord.type,
          currentRecord.description,
          format(currentRecord.date, "yyyy-MM-dd")
        )
        if (result?.success) {
          setMedicalHistories(
            medicalHistories.map((ms) => (ms.id === currentRecord.id ? currentRecord : ms))
          )
          toast.success("Historial médico actualizado correctamente.", {
            autoClose: 2000,
          })
        }
      } else {
        const result = await createNewMedicalHistory(
          id,
          currentRecord.type,
          currentRecord.description,
          format(currentRecord.date, "yyyy-MM-dd")
        )
        if(result.success) {
          setMedicalHistories([...medicalHistories, currentRecord])
          toast.success("Historial médico añadido correctamente.", {
            autoClose: 2000,
          })
        } 
      }
      setIsOpen(false)
    } catch (error) {
      toast.error("Error al guardar el historial médico.")
    }
  }


  return (
    <div className="px-4 space-y-6 sm:px-6 py-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-2xl font-bold w-full sm:w-auto underline">Historiales médicos {name}</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Añadir historial
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Editar historial médico" : "Añadir historial médico"}</DialogTitle>
              <DialogDescription>Complete los detalles del historial médico de su mascota.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={currentRecord.type}
                  onValueChange={(value) => setCurrentRecord({ ...currentRecord, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicalTypes.map((type) => (
                      <SelectItem key={type} value={type} className="cursor-pointer">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={currentRecord.description}
                  onChange={(e) =>
                    setCurrentRecord({
                      ...currentRecord,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describa el procedimiento o tratamiento"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Fecha</Label>
                <DatePicker 
                  selected={currentRecord.date}
                  onSelect={(date: Date) =>
                  setCurrentRecord({ ...currentRecord, date: date || new Date() })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {medicalHistories.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No hay historiales médicos registrados.</div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicalHistories.map((ms) => (
                <TableRow key={ms.id}>
                  <TableCell className="font-medium">{ms.type}</TableCell>
                  <TableCell>{ms.description}</TableCell>
                  <TableCell>{format(ms.date, "dd/MM/yyyy", { locale: es })}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(ms)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedToDelete(ms.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminación de historial médico</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará el historial médico permanentemente. ¿Deseas continuar?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-800 hover:bg-red-700"
                                onClick={() => {
                                  if (selectedToDelete !== null) {
                                    handleDelete(selectedToDelete)
                                    setSelectedToDelete(null)
                                  }
                                }}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
