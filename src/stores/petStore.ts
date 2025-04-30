import { create } from "zustand"

type PetState = {
  id: number | undefined
  user_id: number | undefined
  name: string
  breed: string
  gender: string
  weight: number
  birthday: Date | undefined
  photo: string

  setId: (value: number) => void
  setUserId: (value: number) => void
  setName: (value: string) => void
  setBreed: (value: string) => void
  setGender: (value: string) => void
  setWeight: (value: number) => void
  setBirthday: (value: Date) => void
  setPhoto: (value: string) => void

  setPet: (pet: { id: number, user_id: number, name: string, breed: string, gender: string, weight: number, birthday: string, photo: string }) => void
  resetPet: () => void
}

export const usePetStore = create<PetState>((set) => ({
  id: undefined,
  user_id: undefined,
  name: "",
  breed: "",
  gender: "",
  weight: 0,
  birthday: undefined,
  photo: "",

  setId: (value) => set({ id: value }),
  setUserId: (value) => set({ user_id: value }),
  setName: (value) => set({ name: value }),
  setBreed: (value) => set({ breed: value }),
  setGender: (value) => set({ gender: value }),
  setWeight: (value) => set({ weight: value }),
  setBirthday: (value) => set({ birthday: value }),
  setPhoto: (value) => set({photo: value}),

  setPet: (pet) => set({
    id: pet.id,
    user_id: pet.user_id,
    name: pet.name,
    breed: pet.breed,
    gender: pet.gender,
    weight: pet.weight,
    birthday: new Date(pet.birthday),
  }),

  resetPet: () => set({
    id: undefined,
    user_id: 0,
    name: "",
    breed: "",
    gender: "",
    weight: 0,
    birthday: undefined,
  }),
}))
