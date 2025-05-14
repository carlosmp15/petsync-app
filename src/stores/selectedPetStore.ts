import { create } from "zustand"

type SelectedPetState = {
    id: number | undefined
  
    setSelectedPet: (pet: { id: number }) => void
    resetSelectedPet: () => void
  }
  
  export const useSelectedPetStore = create<SelectedPetState>((set) => ({
    id: undefined,
  
    setSelectedPet: (pet) => set({ id: pet.id}),
    resetSelectedPet: () => set({ id: undefined }),
  }))
  