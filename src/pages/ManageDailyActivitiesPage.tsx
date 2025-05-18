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
import { DailyActivityProps } from "@/types"
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
import { createNewDailyActivity, deleteDailyActivity, getAllDailyActivityByPetId, updateDailyActivity } from "@/services/DailyActivityService"
import { Input } from "@/components/ui/input"


const activityTypes = ["Paseo", "Juego", "Entrenamiento", "Cepillado", "Baño", "Descanso", "Socialización", "Otro"]

export default function ManageDailyActivitiesPage() {
  const [dailyActivities, setDailyActivities] = useState<DailyActivityProps[]>([])
  const [selectedToDelete, setSelectedToDelete] = useState<number | null>(null)
  const { id, name } = useSelectedPetStore()

  const fetchMedicalHistories = async () => {
    try {
      const result = await getAllDailyActivityByPetId(id)

      if (result?.success) {
        setDailyActivities(result.data)
      } else {
        setDailyActivities([])
      }
    } catch (error) {
      setDailyActivities([])
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
  const [currentRecord, setCurrentRecord] = useState<DailyActivityProps>({
    id: 0,
    type: "",
    duration: 1,
    notes: "",
    date: new Date()
  })

  // Función para abrir el formulario en modo añadir
  const handleAddNew = () => {
    setIsEditMode(false)
    setCurrentRecord({
      id: 0,
      type: "",
      duration: 1,
      notes: "",
      date: new Date()
    })
    setIsOpen(true)
  }

  const handleEdit = (da: DailyActivityProps) => {
    setIsEditMode(true)
    setCurrentRecord({ ...da })
    setIsOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteDailyActivity(id)
      if(result?.success) {
        setDailyActivities(dailyActivities.filter((da) => da.id !== id))
        toast.success("Actividad diaria eliminada correctamente", {
          autoClose: 2000
        })
      }
    } catch (error) {
      toast.error("Error inesperado al eliminar una actividad diaria.")
    }
  }

  const handleSave = async () => {
    if (!currentRecord.type || !currentRecord.duration) {
      toast.error("Todos los campos son obligatorios.", {
        autoClose: 2000,
      })
      return
    }

    try {
      if (isEditMode) {
        const result = await updateDailyActivity(
          currentRecord.id,
          currentRecord.type,
          currentRecord.duration,
          currentRecord.notes,
          format(currentRecord.date, "yyyy-MM-dd")
        )
        console.log(result)
        if (result?.success) {
          setDailyActivities(
            dailyActivities.map((da) => (da.id === currentRecord.id ? currentRecord : da))
          )
          toast.success("Actividad diaria actualizada correctamente.", {
            autoClose: 2000,
          })
        }
      } else {
        const result = await createNewDailyActivity(
          id,
          currentRecord.type,
          currentRecord.duration,
          currentRecord.notes,
          format(currentRecord.date, "yyyy-MM-dd")
        )
        if(result.success) {
          setDailyActivities([...dailyActivities, currentRecord])
          toast.success("Actividad diaria añadida correctamente.", {
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
        <h2 className="text-2xl font-bold w-full sm:w-auto underline">Actividades diarias {name}</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Añadir actividad
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Editar actividad diaria" : "Añadir actividad diaria"}</DialogTitle>
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
                    {activityTypes.map((type) => (
                      <SelectItem key={type} value={type} className="cursor-pointer">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Duración {'(min)'}</Label>
                <Input 
                  type="number"
                  min={1}
                  placeholder="Ej. 30 min"
                  value={currentRecord.duration}
                  onChange={(e) =>
                    setCurrentRecord({
                      ...currentRecord,
                      duration: +e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Notas</Label>
                <Textarea
                  id="description"
                  value={currentRecord.notes}
                  onChange={(e) =>
                    setCurrentRecord({
                      ...currentRecord,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Ej. Jugó con otros perros en el parque y estuvo muy activo"
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

      {dailyActivities.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No hay actividades diarias registradas.</div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Notas</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyActivities.map((da) => (
                <TableRow key={da.id}>
                  <TableCell className="font-medium">{da.type}</TableCell>
                  <TableCell>{da.duration}{' minutos'}</TableCell>
                  <TableCell>{da.notes}</TableCell>
                  <TableCell>{format(da.date, "dd/MM/yyyy", { locale: es })}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(da)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedToDelete(da.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminación de actividad diaria</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará la actividad diaria permanentemente. ¿Deseas continuar?
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
