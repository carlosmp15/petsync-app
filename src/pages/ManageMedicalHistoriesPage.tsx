import {
  createNewMedicalHistory,
  deleteMedicalHistory,
  getAllMedicalHistoryByPetId,
  updateMedicalHistory,
} from "@/services/MedicalHistoryService";
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
import type { MedicalHistoryProps } from "@/types";
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
import { useForm, Controller } from "react-hook-form";

const medicalTypes = [
  "Vacunación",
  "Consulta general",
  "Cirugía",
  "Desparasitación",
  "Análisis",
  "Tratamiento",
  "Otro",
];

interface MedicalHistoryFormData {
  type: string;
  description: string;
  date: Date;
}

export default function ManageMedicalHistoriesPage() {
  const [medicalHistories, setMedicalHistories] = useState<
    MedicalHistoryProps[]
  >([]);
  const [selectedToDelete, setSelectedToDelete] = useState<number | null>(null);
  const { id, name } = useSelectedPetStore();

  const fetchMedicalHistories = async () => {
    try {
      const result = await getAllMedicalHistoryByPetId(id);

      if (result?.success) {
        setMedicalHistories(result.data);
      } else {
        setMedicalHistories([]);
      }
    } catch (error) {
      setMedicalHistories([]);
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
  const [currentRecord, setCurrentRecord] = useState<MedicalHistoryProps>({
    id: 0,
    type: "",
    description: "",
    date: new Date(),
  });

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicalHistoryFormData>({
    defaultValues: {
      type: "",
      description: "",
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
      date: new Date(),
    });
    reset({
      type: "",
      description: "",
      date: new Date(),
    });
    setIsOpen(true);
  };

  const handleEdit = (ms: MedicalHistoryProps) => {
    setIsEditMode(true);
    setCurrentRecord({ ...ms });
    reset({
      type: ms.type,
      description: ms.description,
      date: ms.date,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteMedicalHistory(id);
      if (result?.success) {
        setMedicalHistories(medicalHistories.filter((ms) => ms.id !== id));
        toast.success("Historial médico eliminado correctamente", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Error inesperado al eliminar un historial médico.");
    }
  };

  const onSubmit = async (data: MedicalHistoryFormData) => {
    try {
      if (isEditMode) {
        const result = await updateMedicalHistory(
          currentRecord.id,
          data.type,
          data.description,
          format(data.date, "yyyy-MM-dd")
        );
        if (result?.success) {
          setMedicalHistories(
            medicalHistories.map((ms) =>
              ms.id === currentRecord.id ? { ...currentRecord, ...data } : ms
            )
          );
          toast.success("Historial médico actualizado correctamente.", {
            autoClose: 2000,
          });
        }
      } else {
        const result = await createNewMedicalHistory(
          id,
          data.type,
          data.description,
          format(data.date, "yyyy-MM-dd")
        );
        if (result.success) {
          setMedicalHistories([
            ...medicalHistories,
            { ...currentRecord, ...data },
          ]);
          toast.success("Historial médico añadido correctamente.", {
            autoClose: 2000,
          });
        }
      }
      setIsOpen(false);
    } catch (error) {
      toast.error("Error al guardar el historial médico.");
    }
  };

  return (
    <div className="px-4 space-y-6 sm:px-6 py-5">
      <h2 className="text-2xl font-bold w-full sm:w-auto underline">
        Historiales médicos {name}
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
                  Añadir historial
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode
                      ? "Editar historial médico"
                      : "Añadir historial médico"}
                  </DialogTitle>
                  <DialogDescription>
                    Complete los detalles del historial médico de su mascota.
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
                        required: "El tipo de historial médico es requerido",
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
                            {medicalTypes.map((type) => (
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
                          value: 5,
                          message:
                            "La descripción debe tener al menos 5 caracteres",
                        },
                        maxLength: {
                          value: 1000,
                          message:
                            "La descripción no puede exceder 1000 caracteres",
                        },
                      }}
                      render={({ field }) => (
                        <Textarea
                          id="description"
                          {...field}
                          placeholder="Describa el procedimiento o tratamiento"
                          maxLength={1000}
                          rows={4}
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

                  <DialogFooter className="flex flex-col gap-3 md:flex-row md:gap-1 md:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="w-full md:w-auto"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="w-full md:w-auto">
                      Guardar
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {medicalHistories.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay historiales médicos registrados.
            </div>
          ) : (
            <>
              {/* Cards para pantallas pequeñas */}
              <div className="sm:hidden grid gap-4 mb-6">
                {medicalHistories.map((ms) => (
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
                                Eliminación de historial médico
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará el historial médico
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
                      <strong>Fecha:</strong>{" "}
                      {format(ms.date, "dd/MM/yyyy", { locale: es })}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tabla para pantallas medianas y grandes */}
              <div className="hidden sm:block border rounded-md">
                <Table className="overflow-hidden rounded-md">
                  <TableHeader>
                    <TableRow className="bg-[#2B2B2B] hover:bg-[#3A3A3A] rounded-t-md transition-colors">
                      <TableHead className="text-white pl-3">Tipo</TableHead>
                      <TableHead className="text-white">Descripción</TableHead>
                      <TableHead className="text-white">Fecha</TableHead>
                      <TableHead className="text-right text-white pr-3">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicalHistories.map((ms) => (
                      <TableRow key={ms.id}>
                        <TableCell className="font-medium">{ms.type}</TableCell>
                        <TableCell>{ms.description}</TableCell>
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
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                  <span className="sr-only">Eliminar</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Eliminación de historial médico
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción eliminará el historial médico
                                    permanentemente. ¿Deseas continuar?
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
            </>
          )}
        </>
      )}
    </div>
  );
}
