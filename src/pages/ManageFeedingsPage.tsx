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
import type { FeedingProps } from "@/types";
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
import { useForm, Controller } from "react-hook-form";

const feedingTypes = [
  "Croquetas / pienso seco",
  "Comida húmeda enlatada",
  "Dieta BARF (cruda o cocida)",
  "Premios / snacks",
  "Comida casera cocida",
  "Leche para cachorros",
  "Alimento especializado (renal, hipoalergénico, etc.)",
  "Suplementos alimenticios",
  "Frutas y verduras permitidas",
  "Comida medicada",
  "Alimento para entrenamiento",
  "Agua fresca",
  "Otro",
];

interface FeedingFormData {
  type: string;
  description: string;
  quantity: number;
  date: Date;
}

export default function ManageFeedingsPage() {
  const [feedings, setFeedings] = useState<FeedingProps[]>([]);
  const [selectedToDelete, setSelectedToDelete] = useState<number | null>(null);
  const { id, name } = useSelectedPetStore();

  const fetchFeedings = async () => {
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
    fetchFeedings();
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      fetchFeedings();
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

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedingFormData>({
    defaultValues: {
      type: "",
      description: "",
      quantity: 1,
      date: new Date(),
    },
  });

  // Función para abrir el formulario en modo añadir
  const handleAddNew = () => {
    setIsEditMode(false);
    setCurrentRecord({
      id: 0,
      type: "",
      description: "",
      quantity: 1,
      date: new Date(),
    });
    reset({
      type: "",
      description: "",
      quantity: 1,
      date: new Date(),
    });
    setIsOpen(true);
  };

  const handleEdit = (f: FeedingProps) => {
    setIsEditMode(true);
    setCurrentRecord({ ...f });
    reset({
      type: f.type,
      description: f.description,
      quantity: f.quantity,
      date: f.date,
    });
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

  const onSubmit = async (data: FeedingFormData) => {
    try {
      if (isEditMode) {
        const result = await updateFeeding(
          currentRecord.id,
          data.type,
          data.description,
          data.quantity,
          format(data.date, "yyyy-MM-dd")
        );
        if (result?.success) {
          setFeedings(
            feedings.map((f) =>
              f.id === currentRecord.id ? { ...currentRecord, ...data } : f
            )
          );
          toast.success("Historial alimentario actualizado correctamente.", {
            autoClose: 2000,
          });
        }
      } else {
        const result = await createNewFeeding(
          id,
          data.type,
          data.description,
          data.quantity,
          format(data.date, "yyyy-MM-dd")
        );
        if (result.success) {
          setFeedings([...feedings, { ...currentRecord, ...data }]);
          toast.success("Historial alimentario añadido correctamente.", {
            autoClose: 2000,
          });
        }
      }
      fetchFeedings();
      setIsOpen(false);
    } catch (error) {
      toast.error("Error al guardar el historial alimentario.");
    }
  };

  return (
    <div className="px-4 space-y-6 sm:px-6 py-5">
      <h2 className="text-2xl font-bold underline w-full sm:w-auto">
        Historiales alimentarios {name}
      </h2>
      {id === undefined && name === undefined ? (
        <p className="text-center py-10 text-muted-foreground">
          No hay mascotas registradas para este usuario.
          <br /> Por favor, añade una mascota para comenzar a gestionar su
          historial.
        </p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
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
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid gap-4 py-4"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Controller
                      control={control}
                      name="type"
                      rules={{
                        required: "El tipo de alimentación es requerido",
                      }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                      )}
                    />
                    {errors.type && (
                      <span className="text-red-500 text-sm">
                        {errors.type.message}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Controller
                      control={control}
                      name="description"
                      rules={{
                        required: "La descripción es requerida",
                        minLength: {
                          value: 3,
                          message:
                            "La descripción debe tener al menos 3 caracteres",
                        },
                        maxLength: {
                          value: 500,
                          message:
                            "La descripción no puede exceder 500 caracteres",
                        },
                      }}
                      render={({ field }) => (
                        <Textarea
                          id="description"
                          {...field}
                          placeholder="Detalle la alimentación suministrada"
                          maxLength={500}
                        />
                      )}
                    />
                    {errors.description && (
                      <span className="text-red-500 text-sm">
                        {errors.description.message}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Cantidad {"(gramos)"}</Label>
                    <Controller
                      control={control}
                      name="quantity"
                      rules={{
                        required: "La cantidad es requerida",
                        min: {
                          value: 1,
                          message: "La cantidad debe ser al menos 1 gramo",
                        },
                        max: {
                          value: 500,
                          message: "La cantidad no puede exceder 500 gramos",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="number"
                          id="quantity"
                          placeholder="Ej. 100 g"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                    {errors.quantity && (
                      <span className="text-red-500 text-sm">
                        {errors.quantity.message}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Controller
                      control={control}
                      name="date"
                      rules={{ required: "La fecha es requerida" }}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | undefined) =>
                            field.onChange(date || new Date())
                          }
                        />
                      )}
                    />
                    {errors.date && (
                      <span className="text-red-500 text-sm">
                        {errors.date.message}
                      </span>
                    )}
                  </div>

                  <DialogFooter>
                    <Button type="submit" className="w-full sm:w-auto">
                      {isEditMode ? "Guardar cambios" : "Añadir historial"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {feedings.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay historiales alimentarios registrados.
            </div>
          ) : (
            <>
              {/* Tabla para escritorio */}
              <div className="hidden sm:block border rounded-md">
                <Table className="overflow-hidden rounded-md">
                  <TableHeader>
                    <TableRow className="bg-[#2B2B2B] hover:bg-[#3A3A3A] rounded-t-md transition-colors">
                      <TableHead className="text-white pl-3">Tipo</TableHead>
                      <TableHead className="text-white">Descripción</TableHead>
                      <TableHead className="text-white">Cantidad (gramos)</TableHead>
                      <TableHead className="text-white">Fecha</TableHead>
                      <TableHead className="text-white pl-5">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedings.map((ms) => (
                      <TableRow key={ms.id}>
                        <TableCell className="font-medium">{ms.type}</TableCell>
                        <TableCell>{ms.description}</TableCell>
                        <TableCell>{ms.quantity}</TableCell>
                        <TableCell>
                          {format(ms.date, "dd/MM/yyyy", { locale: es })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(ms)}
                              aria-label="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedToDelete(ms.id)}
                                  aria-label="Eliminar"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Eliminación de historial alimentario
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción eliminará el historial
                                    alimentario permanentemente. ¿Deseas
                                    continuar?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
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

              {/* Cards para móvil */}
              <div className="grid gap-4 sm:hidden">
                {feedings.map((ms) => (
                  <div
                    key={ms.id}
                    className="border rounded-md p-4 shadow-sm bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{ms.type}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(ms)}
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedToDelete(ms.id)}
                              aria-label="Eliminar"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
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
                    </div>

                    <p>
                      <strong>Descripción:</strong> {ms.description}
                    </p>
                    <p>
                      <strong>Cantidad:</strong> {ms.quantity} gramos
                    </p>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {format(ms.date, "dd/MM/yyyy", { locale: es })}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
