import { PetCard } from "@/components/pet-card"
import { getAllPetsByUserId } from "@/services/PetService"
import { PetCardProps } from "@/types";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [pets, setPets] = useState<PetCardProps[]>([])

  const fetchPetsUser = async() => {
    const result = await getAllPetsByUserId(4);
    if (result?.success) {
      const pets: PetCardProps[] = result.data.map((pet: any) => ({
        id: pet.id,
        name: pet.name,
        breed: pet.breed,
        weight: Number(pet.weight),
        photo: pet.photo,
      }));
  
      console.log(pets);
      setPets(pets);
    }
  }
  useEffect(() => {
    fetchPetsUser();
  }, []);
  
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      { pets.map((pet) => (
        <PetCard 
        id={pet.id}
        name={pet.name}
        breed={pet.breed}
        weight={pet.weight}
        photo={pet.photo}
      />
      )) }   
    </div>
  )
}
