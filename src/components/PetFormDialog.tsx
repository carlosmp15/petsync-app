"use client"

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


export function PetFormDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  name,
  setName,
  breed,
  setBreed,
  gender,
  setGender,
  weight,
  setWeight,
  birthday,
  setBirthday,
  photo,
  setPhoto
}: PetFormDialogProps) {
  const [breedSuggestions, setBreedSuggestions] = useState<string[]>([])

  useEffect(() => {
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
    setBreed(input)

    if (input.length >= 2) {
      const filtered = await getFilteredBreeds(input)
      setBreedSuggestions(filtered.slice(0, 6))
    } else {
      setBreedSuggestions([])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-1">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Nombre</Label>
            <Input 
              id="name" 
              placeholder="Nombre de la mascota" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="breed">Raza</Label>
            <Input 
              id="breed" 
              placeholder="Raza de la mascota (ej: Labrador)"
              required 
              value={breed} 
              onChange={handleBreedInputChange} list="breed-suggestions" />
            <datalist id="breed-suggestions">
              {breedSuggestions.map((s) => <option key={s} value={s} />)}
            </datalist>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="gender">Género</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue placeholder="Selecciona el género" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male" className="cursor-pointer">Macho</SelectItem>
                <SelectItem value="female" className="cursor-pointer">Hembra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input id="weight" type="number" min="1" max="90" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="birthday">Fecha de Nacimiento</Label>
            <DatePicker selected={birthday} onSelect={setBirthday} />
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
        </div>

        <DialogFooter>
          <Button type="button" onClick={onSubmit}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}