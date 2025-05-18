import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeedingProps } from "@/types";
import { toast } from "react-toastify";
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
} from "@/components/ui/alert-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { useSelectedPetStore } from "@/stores/selectedPetStore";
import {
  createNewFeeding,
  deleteFeeding,
  getAllFeedingsByPetId,
  updateFeeding,
} from "@/services/FeedingService";
import { Input } from "@/components/ui/input";

const feedingTypes = [
  "Croquetas / pienso seco",
  "Comida húmeda enlatada",
  "Dieta BARF (cruda o cocida)",
  "Premios / snacks",
  "Comida casera cocida",
  "Leche para cachorros / gatitos",
  "Alimento especializado (renal, hipoalergénico, etc.)",
  "Suplementos alimenticios",
  "Frutas y verduras permitidas",
  "Comida medicada",
  "Alimento para entrenamiento",
  "Agua fresca",
  "Otro",
];

export default function ManageFeedingsPage() {
  const [feedings, setFeedings] = useState<FeedingProps[]>([]);
  const [selectedToDelete, setSelectedToDelete] = useState<number | null>(null);
  const { id, name } = useSelectedPetStore();

  const fetchMedicalHistories = async () => {
    try {
      const result = await getAllFeedingsByPetId(id);

      if (result?.success) {
        setFeedings(result.data);
      } else {
        setFeedings([]);
      }
    } catch (error) {
      setFeedings([]);
    }
  };

  useEffect(() => {
    fetchMedicalHistories();
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      fetchMedicalHistories();
    }
  }, [id]);

  // Estado para el formulario
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<FeedingProps>({
    id: 0,
    type: "",
    description: "",
    quantity: 1,
    date: new Date(),
  });

  // Función para abrir el formulario en modo añadir
  const handleAddNew = () => {
    setIsEditMode(false);
    setCurrentRecord({
      id: 0,
      type: "",
      description: "",
      quantity: 0,
      date: new Date(),
    });
    setIsOpen(true);
  };

  const handleEdit = (f: FeedingProps) => {
    setIsEditMode(true);
    setCurrentRecord({ ...f });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteFeeding(id);
      if (result?.success) {
        setFeedings(feedings.filter((f) => f.id !== id));
        toast.success("Historial alimentario eliminado correctamente", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Error inesperado al eliminar un historial alimentario.");
    }
  };

  const handleSave = async () => {
    if (!currentRecord.type || !currentRecord.description) {
      toast.error("Todos los campos son obligatorios.", {
        autoClose: 2000,
      });
      return;
    }

    try {
      if (isEditMode) {
        const result = await updateFeeding(
          currentRecord.id,
          currentRecord.type,
          currentRecord.description,
          currentRecord.quantity,
          format(currentRecord.date, "yyyy-MM-dd")
        );
        if (result?.success) {
          setFeedings(
            feedings.map((f) => (f.id === currentRecord.id ? currentRecord : f))
          );
          toast.success("Historial alimentario actualizado correctamente.", {
            autoClose: 2000,
          });
        }
      } else {
        const result = await createNewFeeding(
          id,
          currentRecord.type,
          currentRecord.description,
          currentRecord.quantity,
          format(currentRecord.date, "yyyy-MM-dd")
        );
        if (result.success) {
          setFeedings([...feedings, currentRecord]);
          toast.success("Historial alimentario añadido correctamente.", {
            autoClose: 2000,
          });
        }
      }
      setIsOpen(false);
    } catch (error) {
      toast.error("Error al guardar el historial alimentario.");
    }
  };

  return (
    <div className="px-4 space-y-6 sm:px-6 py-5">
      {id === undefined && name === undefined ? (
        <p className="text-center py-10 text-muted-foreground">
          No hay mascotas registradas para este usuario.<br/> Por favor, cree una
          mascota para comenzar a gestionar su historial.
        </p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h2 className="text-2xl font-bold underline w-full sm:w-auto">
              Historiales alimentarios {name}
            </h2>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddNew} className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir alimentación
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode
                      ? "Editar historial alimentario"
                      : "Añadir historial alimentario"}
                  </DialogTitle>
                  <DialogDescription>
                    Complete los detalles del historial alimentario de su
                    mascota.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={currentRecord.type}
                      onValueChange={(value) =>
                        setCurrentRecord({ ...currentRecord, type: value })
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {feedingTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="cursor-pointer"
                          >
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
                      placeholder="Detalle la alimentación suministrada"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Cantidad {"(gramos)"}</Label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Ej. 100 g"
                      value={currentRecord.quantity}
                      onChange={(e) =>
                        setCurrentRecord({
                          ...currentRecord,
                          quantity: +e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Fecha</Label>
                    <DatePicker
                      selected={currentRecord.date}
                      onSelect={(date: Date) =>
                        setCurrentRecord({
                          ...currentRecord,
                          date: date || new Date(),
                        })
                      }
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

          {feedings.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay historiales alimentarios registrados.
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedings.map((ms) => (
                    <TableRow key={ms.id}>
                      <TableCell className="font-medium">{ms.type}</TableCell>
                      <TableCell>{ms.description}</TableCell>
                      <TableCell>
                        {ms.quantity}
                        {" gramos"}
                      </TableCell>
                      <TableCell>
                        {format(ms.date, "dd/MM/yyyy", { locale: es })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(ms)}
                          >
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
                                <AlertDialogTitle>
                                  Eliminación de historial alimentario
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará el historial alimentario
                                  permanentemente. ¿Deseas continuar?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-800 hover:bg-red-700"
                                  onClick={() => {
                                    if (selectedToDelete !== null) {
                                      handleDelete(selectedToDelete);
                                      setSelectedToDelete(null);
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
        </>
      )}
    </div>
  );
}
