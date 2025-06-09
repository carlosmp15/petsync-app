import { PetCard } from "@/components/pet-card"
import { getAllPetsByUserId } from "@/services/PetService"
import type { PetCardProps } from "@/types"
import { getUserDataFromLocalStorage } from "@/utils"
import { useEffect, useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [pets, setPets] = useState<PetCardProps[]>([])
  const [searchName, setSearchName] = useState("")
  const [filterGender, setFilterGender] = useState<string>("all")
  const [filterWeight, setFilterWeight] = useState("")
  const userData = getUserDataFromLocalStorage()

  const fetchPetsUser = async () => {
    const result = await getAllPetsByUserId(userData?.id)

    if (result?.success) {
      setPets(result.data.data)
    }
  }

  const handleDeletePet = (id: number) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== id))
  }

  const clearFilters = () => {
    setSearchName("")
    setFilterGender("all")
    setFilterWeight("")
  }

  const hasActiveFilters = searchName || filterGender !== "all" || filterWeight

  // Filter pets based on the current filter values
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      // Filter by name
      const matchesName = pet.name.toLowerCase().includes(searchName.toLowerCase())

      // Filter by gender
      const matchesGender = filterGender === "all" || pet.gender.toLowerCase() === filterGender.toLowerCase()

      // Filter by weight
      const matchesWeight = !filterWeight || pet.weight <= Number.parseFloat(filterWeight)

      return matchesName && matchesGender && matchesWeight
    })
  }, [pets, searchName, filterGender, filterWeight])

  useEffect(() => {
    fetchPetsUser()
  }, [])

  return (
    <div className="px-4 space-y-6 sm:px-6 py-5">
      <h1 className="text-2xl font-bold underline mb-6">Mis mascotas</h1>

      {/* Filters Section */}
      <div className="bg-card border rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Filtros</h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search by name */}
          <div className="space-y-2">
            <Label htmlFor="search-name" className="text-sm font-medium">
              Buscar por nombre
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-name"
                type="text"
                placeholder="Nombre de la mascota..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter by gender */}
          <div className="space-y-2">
            <Label htmlFor="filter-gender" className="text-sm font-medium">
              Filtrar por sexo
            </Label>
            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger id="filter-gender">
                <SelectValue placeholder="Seleccionar sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">Todos</SelectItem>
                <SelectItem value="male" className="cursor-pointer">Macho</SelectItem>
                <SelectItem value="female" className="cursor-pointer">Hembra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter by weight */}
          <div className="space-y-2">
            <Label htmlFor="filter-weight" className="text-sm font-medium">
              Peso máximo (kg)
            </Label>
            <Input
              id="filter-weight"
              type="number"
              placeholder="Ej: 25"
              value={filterWeight}
              onChange={(e) => setFilterWeight(e.target.value)}
              min="0"
              step="0.1"
            />
          </div>
        </div>

        {/* Results count */}
        {pets.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredPets.length} de {pets.length} mascotas
              {hasActiveFilters && " (filtradas)"}
            </p>
          </div>
        )}
      </div>

      {/* Pet Cards */}
      {pets.length === 0 ? (
        <div>
          <p className="text-muted-foreground text-center">No tienes mascotas registradas.</p>
          <p className="text-muted-foreground mt-1 text-center">
            Haz clic en <strong>"Nueva mascota"</strong> para registrar una y poder visualizarla aquí.
          </p>
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron mascotas con los filtros aplicados.</p>
          <Button variant="outline" onClick={clearFilters} className="mt-4">
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <PetCard
                id={pet.id}
                name={pet.name}
                breed={pet.breed}
                gender={pet.gender}
                weight={pet.weight}
                birthday={pet.birthday}
                photo={pet.photo}
                onDelete={handleDeletePet}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
