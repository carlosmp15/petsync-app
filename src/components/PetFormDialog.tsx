import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RotateCw } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { getFilteredBreeds, getPetImage } from "@/services/PetService"
import { ComboBox } from "./ComboBox"
import { ComboBoxItem } from "@/types"

interface PetFormData {
  name: string
  breed: string
  gender: string
  weight: number
  birthday: Date | null
}

export interface PetFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: PetFormData, newPhoto: string) => Promise<void>
  defaultPhoto?: string
  defaultValues?: Partial<PetFormData>
  isEdit: boolean
}

export function PetFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultPhoto = "",
  defaultValues,
  isEdit
}: PetFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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
      birthday: null
    },
  })

  const [breeds, setBreeds] = useState<ComboBoxItem[]>([])
  const [userChangedBreed, setUserChangedBreed] = useState(false)
  const breed = watch("breed")
  const [photo, setPhoto] = useState(defaultPhoto)

  useEffect(() => {
    if (breed && (!isEdit || userChangedBreed)) {
      handleChangePhoto(breed)
    }
  }, [breed, isEdit, userChangedBreed])



  useEffect(() => {
    const fetchBreeds = async () => {
      const allBreeds = await getFilteredBreeds()
      if(allBreeds) {
        setBreeds(allBreeds)
      }
    }
    fetchBreeds()
  }, [])

  useEffect(() => {
    if (open) {
      const resetValues =
        isEdit && defaultValues
          ? {
              name: defaultValues.name || "",
              breed: defaultValues.breed || "",
              gender: defaultValues.gender || "",
              weight: defaultValues.weight ?? undefined,
              birthday: defaultValues.birthday
                ? new Date(defaultValues.birthday)
                : null,
            }
          : {
              name: "",
              breed: "",
              gender: "",
              weight: undefined,
              birthday: new Date(),
            };

      reset(resetValues);
      setPhoto(defaultPhoto);
    }
  }, [open, defaultValues, defaultPhoto, reset, isEdit]);

  const handleChangePhoto = async (selectedBreed: string) => {
    const url = await getPetImage(selectedBreed)
    if (url.success && url.message) {
      setPhoto(url.message)
    }
  }

  const onInternalSubmit = (data: PetFormData) => {
    onSubmit(data, photo)
    reset()
    setPhoto("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          
          <DialogTitle>{isEdit ? "Editar Mascota" : "Nueva Mascota"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica los datos de tu mascota."
              : "Ingresa los datos de tu nueva mascota."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onInternalSubmit)} className="grid gap-4 py-1">
          {/* Nombre */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">
              Nombre <span className="text-red-500 font-bold">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nombre de la mascota"
              {...register("name", {
                validate: (v) => (v && v.trim() !== "") || "El nombre es requerido",
              })}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>

          {/* Raza */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="breed">
              Raza <span className="text-red-500 font-bold">*</span>
            </Label>
            <ComboBox
              items={breeds}
              value={getValues("breed")}
              onChange={(val) => {
                setValue("breed", val)
                setUserChangedBreed(true)
              }}
              placeholder="Selecciona una raza"
            />
            {errors.breed && (
              <span className="text-red-500 text-sm">{errors.breed.message}</span>
            )}
          </div>

          {/* Género */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="gender">
              Género <span className="text-red-500 font-bold">*</span>
            </Label>
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
              <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
            )}
          </div>

          {/* Peso */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="weight">
              Peso (kg) <span className="text-red-500 font-bold">*</span>
            </Label>
            <Input
              type="number"
              id="weight"
              placeholder="Peso de la mascota"
              {...register("weight", {
                valueAsNumber: true,
                validate: (v) => {
                const num = Number(v);
                if (isNaN(num) || num <= 0)
                  return "El peso debe ser un número válido mayor a 0";
                if (num > 60) return "El peso no puede ser mayor a 60 kg";
                return true;
              }
              })}
            />
            {errors.weight && (
              <span className="text-red-500 text-sm">{errors.weight.message}</span>
            )}
          </div>

          {/* Fecha de nacimiento */}
           <div className="flex flex-col gap-1">
            <Label htmlFor="birthday">
              Fecha de nacimiento <span className="text-red-500 font-bold">*</span>
            </Label>
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
              <div className="relative w-32 h-32">
                <img
                  src={photo}
                  alt={`Raza ${breed}`}
                  className="w-full h-full object-cover rounded-lg select-none"
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
  )
}
