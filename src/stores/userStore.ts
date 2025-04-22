import { create } from "zustand"

interface UserState {
  name: string
  surname: string
  email: string
  phone: string
  password: string
  birthday: Date | undefined

  setName: (value: string) => void
  setSurname: (value: string) => void
  setEmail: (value: string) => void
  setPhone: (value: string) => void
  setPassword: (value: string) => void
  setBirthday: (value: Date) => void

  resetUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  name: "",
  surname: "",
  email: "",
  phone: "",
  password: "",
  birthday: undefined,

  setName: (value) => set({ name: value }),
  setSurname: (value) => set({ surname: value }),
  setEmail: (value) => set({ email: value }),
  setPhone: (value) => set({ phone: value }),
  setPassword: (value) => set({ password: value }),
  setBirthday: (value) => set({ birthday: value }),

  resetUser: () =>
    set({
      name: "",
      surname: "",
      email: "",
      phone: "",
      password: "",
      birthday: undefined,
    }),
}))
