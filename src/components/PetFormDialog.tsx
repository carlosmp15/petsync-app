import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCw } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getFilteredBreeds, getPetImage } from "@/services/PetService";
import { is } from "date-fns/locale";

interface PetFormData {
  name: string;
  breed: string;
  gender: string;
  weight: number;
  birthday: Date | null;
}

export interface PetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PetFormData, newPhoto: string) => Promise<void>;
  defaultPhoto?: string;
  defaultValues?: Partial<PetFormData>;
  isEdit: boolean;
}

export function PetFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultPhoto = "",
  defaultValues,
  isEdit,
}: PetFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<PetFormData>({
    defaultValues: {
      name: "",
      breed: "",
      gender: "",
      weight: undefined,
      birthday: null,
      ...defaultValues,
    },
  });

  const breed = watch("breed");
  const [photo, setPhoto] = useState(defaultPhoto);
  const [breedSuggestions, setBreedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (breed && breedSuggestions.includes(breed)) {
      handleChangePhoto(breed);
    }
  }, [breed]);

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name || "",
        breed: defaultValues?.breed || "",
        gender: defaultValues?.gender || "",
        weight: defaultValues?.weight || undefined,
        birthday:
          isEdit && defaultValues?.birthday
            ? new Date(defaultValues.birthday)
            : null,
      });
      setPhoto(defaultPhoto);
    }
  }, [open, defaultValues, defaultPhoto, reset]);

  const handleChangePhoto = async (selectedBreed: string) => {
    const url = await getPetImage(selectedBreed);
    if (url.success && url.message) {
      setPhoto(url.message);
    }
  };

  const handleBreedInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value;
    setValue("breed", input, { shouldValidate: true });
    if (input.length >= 2) {
      const filtered = await getFilteredBreeds(input);
      setBreedSuggestions(filtered.slice(0, 6));
    } else {
      setBreedSuggestions([]);
    }
  };

  const onInternalSubmit = (data: PetFormData) => {
    onSubmit(data, photo);
    reset();
    setPhoto("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Mascota" : "Nueva Mascota"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica los datos de tu mascota."
              : "Ingresa los datos de tu nueva mascota."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onInternalSubmit)}
          className="grid gap-4 py-1"
        >
          {/* Nombre */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Nombre de la mascota"
              {...register("name", {
                validate: (v) =>
                  (v && v.trim() !== "") || "El nombre es requerido",
              })}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Raza */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="breed">Raza</Label>
            <Input
              id="breed"
              placeholder="Raza de la mascota"
              list="breed-suggestions"
              value={breed}
              {...register("breed", {
                validate: (v) =>
                  (v && v.trim() !== "") || "La raza es requerida",
              })}
              onChange={(e) => {
                handleBreedInputChange(e);
                // Call react-hook-form's onChange as well
                register("breed").onChange(e);
              }}
            />
            <datalist id="breed-suggestions">
              {breedSuggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            {errors.breed && (
              <span className="text-red-500 text-sm">
                {errors.breed.message}
              </span>
            )}
          </div>

          {/* Género */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="gender">Género</Label>
            <Controller
              control={control}
              name="gender"
              rules={{ required: "El género es requerido" }}
              defaultValue=""
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Macho</SelectItem>
                    <SelectItem value="female">Hembra</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Peso */}
          <Controller
            control={control}
            name="weight"
            rules={{
              required: "El peso es requerido",
              validate: (v) =>
                (v >= 1 && v <= 60) || "El peso debe estar entre 1 kg y 60 kg",
            }}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Peso de la mascota"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {errors.weight && (
                  <span className="text-red-500 text-sm">
                    {errors.weight.message}
                  </span>
                )}
              </div>
            )}
          />

          {/* Fecha de nacimiento */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="birthday">Fecha de nacimiento</Label>
            <Controller
              control={control}
              name="birthday"
              rules={{ required: "Fecha de nacimiento requerida" }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ?? undefined}
                  onChange={(date: Date | undefined) => field.onChange(date)}
                />
              )}
            />
            {errors.birthday && (
              <span className="text-red-500 text-sm">
                {errors.birthday.message}
              </span>
            )}
          </div>

          {/* Imagen */}
          {photo && (
            <div>
              <Label>Imagen</Label>
              <div className="relative w-32 h-32 select-none">
                <img
                  src={photo}
                  alt={`Raza ${breed}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <RotateCw
                  onClick={() => handleChangePhoto(breed)}
                  className="absolute bottom-2 right-2 cursor-pointer bg-white rounded-full p-1 shadow"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
