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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCw } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { useEffect, useState } from "react"
import { getFilteredBreeds, getPetImage } from "@/services/PetService"
import { PetFormDialogProps } from "@/types"
import { useForm, Controller } from "react-hook-form"

export function PetFormDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  name,
  breed,
  gender,
  weight,
  birthday,
  photo,
  setPhoto
}: PetFormDialogProps) {
  const [breedSuggestions, setBreedSuggestions] = useState<string[]>([])

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name,
      breed,
      gender,
      weight,
      birthday
    }
  })

  useEffect(() => {
    // Si la raza cambia, actualizar la foto de la mascota
    if (breed && breedSuggestions.includes(breed)) {
      handleChangePhoto(breed)
    }
  }, [breed])

  const handleChangePhoto = async (selectedBreed: string) => {
    const url = await getPetImage(selectedBreed)
    if (url.success && url.message) {
      setPhoto(url.message)
    }
  }

  const handleBreedInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setValue("breed", input)

    if (input.length >= 2) {
      const filtered = await getFilteredBreeds(input)
      setBreedSuggestions(filtered.slice(0, 6))
    } else {
      setBreedSuggestions([])
    }
  }

  const onValidSubmit = (data: any) => {
    // Actualizamos los valores del formulario en el estado principal.
    setPhoto(data.photo) // Actualizar la foto si es necesario.
    onSubmit(data) // Pasamos los datos de la mascota actualizados al componente principal.
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValidSubmit)} className="grid gap-4 py-1">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Nombre de la mascota"
              {...register("name", { required: "El nombre es obligatorio" })}
            />
            {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="breed">Raza</Label>
            <Input
              id="breed"
              placeholder="Raza de la mascota (ej: Labrador)"
              list="breed-suggestions"
              {...register("breed", { required: "La raza es obligatoria" })}
              onChange={handleBreedInputChange}
            />
            <datalist id="breed-suggestions">
              {breedSuggestions.map((s) => <option key={s} value={s} />)}
            </datalist>
            {errors.breed && <span className="text-sm text-red-500">{errors.breed.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="gender">Género</Label>
            <Controller
              name="gender"
              control={control}
              rules={{ required: "El género es obligatorio" }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
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
            {errors.gender && <span className="text-sm text-red-500">{errors.gender.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              min="1"
              max="90"
              {...register("weight", { required: "El peso es obligatorio", min: 1 })}
            />
            {errors.weight && <span className="text-sm text-red-500">{errors.weight.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="birthday">Fecha de Nacimiento</Label>
            <Controller
              name="birthday"
              control={control}
              rules={{ required: "La fecha de nacimiento es obligatoria" }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onSelect={(date) => field.onChange(date)}
                />
              )}
            />
            {errors.birthday && <span className="text-sm text-red-500">{errors.birthday.message}</span>}
          </div>

          {photo && (
            <div>
              <Label>Imagen</Label>
              <div className="relative w-32 h-32">
                <img src={photo} alt={`Raza ${breed}`} className="w-full h-full object-cover rounded-lg" />
                <RotateCw onClick={() => handleChangePhoto(breed)} className="absolute bottom-2 right-2 cursor-pointer bg-white rounded-full p-1 shadow" />
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
