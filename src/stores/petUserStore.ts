import { create } from "zustand"

type Pet = {
  id: number
  name: string
}

type PetUserState = {
  pets: Pet[]

  setPets: (pets: Pet[]) => void
  addPet: (pet: Pet) => void
  updatePet: (pet: Pet) => void
  removePet: (id: number) => void
  resetPets: () => void
}

export const usePetUserStore = create<PetUserState>((set) => ({
  pets: [],

  setPets: (pets) => set({ pets }),

  addPet: (pet) => set((state) => ({
    pets: [...state.pets, pet],
  })),

  updatePet: (updatedPet) => set((state) => ({
    pets: state.pets.map((pet) =>
      pet.id === updatedPet.id ? updatedPet : pet
    ),
  })),

  removePet: (id) => set((state) => ({
    pets: state.pets.filter((pet) => pet.id !== id),
  })),

  resetPets: () => set({ pets: [] }),
}))
