import { create } from "zustand"

type SelectedPetState = {
    id: number | undefined
    name: string | undefined
  
    setSelectedPet: (pet: { id: number, name: string }) => void
    resetSelectedPet: () => void
  }
  
  export const useSelectedPetStore = create<SelectedPetState>((set) => ({
    id: undefined,
    name: undefined,
  
    setSelectedPet: (pet) => set({ id: pet.id, name: pet.name }),
    resetSelectedPet: () => set({ id: undefined, name: undefined}),
  }))
  