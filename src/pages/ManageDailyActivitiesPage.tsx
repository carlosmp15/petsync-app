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
import type { DailyActivityProps } from "@/types";
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
  createNewDailyActivity,
  deleteDailyActivity,
  getAllDailyActivityByPetId,
  updateDailyActivity,
} from "@/services/DailyActivityService";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";

const activityTypes = [
  "Paseo",
  "Juego",
  "Entrenamiento",
  "Cepillado",
  "Baño",
  "Descanso",
  "Socialización",
  "Otro",
];

interface ActivityFormData {
  type: string;
  duration: number;
  notes: string;
  date: Date;
}

export default function ManageDailyActivitiesPage() {
  const [dailyActivities, setDailyActivities] = useState<DailyActivityProps[]>(
    []
  );
  const [selectedToDelete, setSelectedToDelete] = useState<number | null>(null);
  const { id, name } = useSelectedPetStore();

  const fetchDailyActivities = async () => {
    try {
      const result = await getAllDailyActivityByPetId(id);
      if (result?.success) {
        setDailyActivities(result.data);
      } else {
        setDailyActivities([]);
      }
    } catch {
      setDailyActivities([]);
    }
  };

  useEffect(() => {
    if (id !== undefined) fetchDailyActivities();
  }, [id]);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<DailyActivityProps>({
    id: 0,
    type: "",
    duration: 1,
    notes: "",
    date: new Date(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityFormData>({
    defaultValues: {
      type: "",
      duration: 1,
      notes: "",
      date: new Date(),
    },
  });

  const handleAddNew = () => {
    setIsEditMode(false);
    setCurrentRecord({
      id: 0,
      type: "",
      duration: 1,
      notes: "",
      date: new Date(),
    });
    reset({
      type: "",
      duration: 1,
      notes: "",
      date: new Date(),
    });
    setIsOpen(true);
  };

  const handleEdit = (da: DailyActivityProps) => {
    setIsEditMode(true);
    setCurrentRecord({ ...da });
    reset({
      type: da.type,
      duration: da.duration,
      notes: da.notes,
      date: da.date,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteDailyActivity(id);
      if (result?.success) {
        setDailyActivities(dailyActivities.filter((da) => da.id !== id));
        toast.success("Actividad diaria eliminada correctamente", {
          autoClose: 2000,
        });
      }
    } catch {
      toast.error("Error inesperado al eliminar una actividad diaria.");
    }
  };

  const onSubmit = async (data: ActivityFormData) => {
    try {
      if (isEditMode) {
        const result = await updateDailyActivity(
          currentRecord.id,
          data.type,
          data.duration,
          data.notes,
          format(data.date, "yyyy-MM-dd")
        );
        if (result?.success) {
          setDailyActivities(
            dailyActivities.map((da) =>
              da.id === currentRecord.id ? { ...currentRecord, ...data } : da
            )
          );
          toast.success("Actividad diaria actualizada correctamente.", {
            autoClose: 2000,
          });
        }
      } else {
        const result = await createNewDailyActivity(
          id,
          data.type,
          data.duration,
          data.notes,
          format(data.date, "yyyy-MM-dd")
        );
        if (result?.success) {
          setDailyActivities([
            ...dailyActivities,
            { ...currentRecord, ...data },
          ]);
          toast.success("Actividad diaria añadida correctamente.", {
            autoClose: 2000,
          });
        }
      }
      fetchDailyActivities();
      setIsOpen(false);
    } catch {
      toast.error("Error al guardar la actividad diaria.");
    }
  };

  return (
    <div className="px-4 space-y-6 sm:px-6 py-5">
      <h2 className="text-2xl font-bold w-full sm:w-auto underline">
        Actividades diarias {name}
      </h2>
      {id === undefined && name === undefined ? (
        <p className="text-center py-10 text-muted-foreground">
          No hay mascotas registradas para este usuario.
          <br />
          Por favor, añade una mascota para comenzar a gestionar su historial.
        </p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddNew} className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir actividad
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode
                      ? "Editar actividad diaria"
                      : "Añadir actividad diaria"}
                  </DialogTitle>
                  <DialogDescription>
                    Complete los detalles de la actividad diaria de su mascota.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid gap-4 py-4"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="type">
                      Tipo <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="type"
                      rules={{ required: "El tipo de actividad es requerido" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Seleccione un tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {activityTypes.map((type) => (
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
                    <Label htmlFor="duration">
                      Duración (min) <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="duration"
                      rules={{
                        required: "La duración es requerida",
                        min: {
                          value: 1,
                          message: "La duración debe ser al menos 1 minuto",
                        },
                        max: {
                          value: 1440,
                          message: "Duración máx 1440 min (24 horas)",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="number"
                          id="duration"
                          min={1}
                          max={1440}
                          placeholder="Ej. 30 min"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(
                              val === "" ? undefined : Number(val)
                            );
                          }}
                        />
                      )}
                    />
                    {errors.duration && (
                      <span className="text-red-500 text-sm">
                        {errors.duration.message}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">
                      Notas <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="notes"
                      rules={{
                        required: "Las notas son requeridas",
                        maxLength: {
                          value: 500,
                          message: "Las notas no pueden exceder 500 caracteres",
                        },
                      }}
                      render={({ field }) => (
                        <Textarea
                          id="notes"
                          {...field}
                          placeholder="Ej. Jugó con otros perros en el parque y estuvo muy activo"
                          maxLength={500}
                        />
                      )}
                    />
                    {errors.notes && (
                      <span className="text-red-500 text-sm">
                        {errors.notes.message}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="date">
                      Fecha <span className="text-red-500 font-bold">*</span>
                    </Label>
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

          {dailyActivities.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay actividades diarias registradas.
            </div>
          ) : (
            <>
              {/* Tabla para escritorio */}
              <div className="hidden sm:block border rounded-md">
                <Table className="overflow-hidden rounded-md">
                  <TableHeader>
                    <TableRow className="bg-[#2B2B2B] hover:bg-[#3A3A3A] rounded-t-md transition-colors">
                      <TableHead className="text-white pl-3">Tipo</TableHead>
                      <TableHead className="text-white">Duración</TableHead>
                      <TableHead className="text-white">Notas</TableHead>
                      <TableHead className="text-white">Fecha</TableHead>
                      <TableHead className="text-right text-white pr-3">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyActivities.map((da) => (
                      <TableRow key={da.id}>
                        <TableCell className="font-medium">{da.type}</TableCell>
                        <TableCell>{da.duration} minutos</TableCell>
                        <TableCell>{da.notes}</TableCell>
                        <TableCell>
                          {format(da.date, "dd/MM/yyyy", { locale: es })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(da)}
                              aria-label="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Eliminar"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    ¿Eliminar actividad diaria?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. ¿Está
                                    seguro de eliminar esta actividad?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-800 hover:bg-red-700"
                                    onClick={() => handleDelete(da.id)}
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
              <div className="sm:hidden grid gap-3">
                {dailyActivities.map((da) => (
                  <div
                    key={da.id}
                    className="border rounded-md p-4 shadow-sm space-y-2 bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{da.type}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(da)}
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedToDelete(da.id)}
                              aria-label="Eliminar"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Eliminación de actividad diaria
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará la actividad diaria
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
                      <strong>Duración:</strong> {da.duration} minutos
                    </p>
                    <p>
                      <strong>Notas:</strong> {da.notes}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {format(da.date, "dd/MM/yyyy", { locale: es })}
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
