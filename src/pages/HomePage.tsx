import { PetCard } from "@/components/pet-card"
import { getAllPetsByUserId } from "@/services/PetService"
import { PetCardProps } from "@/types"
import { getUserDataFromLocalStorage } from "@/utils"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [pets, setPets] = useState<PetCardProps[]>([])
  const userData = getUserDataFromLocalStorage()

  const fetchPetsUser = async () => {
    const result = await getAllPetsByUserId(userData?.id);
  
    if (result?.success) {
      setPets(result.data.data)
    }
  }

  const handleDeletePet = (id: number) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== id))
  }
  
  useEffect(() => {
    fetchPetsUser()
  }, [])
  
  
  return (
    <div className="px-4 sm:px-6 py-6">
      <h1 className="text-3xl font-bold underline mb-6">Mis mascotas</h1>
  
      {pets.length === 0 ? (
        <p className="text-muted-foreground">No tienes mascotas registradas.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
        {pets.map((pet) => (
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
