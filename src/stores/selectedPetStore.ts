import { create } from "zustand"

type SelectedPetState = {
    id: number | undefined
    name: string
  
    setSelectedPet: (pet: { id: number, name: string }) => void
    resetSelectedPet: () => void
  }
  
  export const useSelectedPetStore = create<SelectedPetState>((set) => ({
    id: undefined,
    name: "",
  
    setSelectedPet: (pet) => set({ id: pet.id, name: pet.name }),
    resetSelectedPet: () => set({ id: undefined, name: "" }),
  }))
  