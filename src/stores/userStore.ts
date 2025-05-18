import { User } from "@/types";
import { create } from "zustand";

type UserState = {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  birthday: Date | undefined;
  id: number | undefined;

  setName: (value: string) => void;
  setSurname: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setPassword: (value: string) => void;
  setBirthday: (value: Date) => void;
  setId: (value: number) => void;

  setUser: (user: User | null) => void;
  resetUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  name: "",
  surname: "",
  email: "",
  phone: "",
  password: "",
  birthday: undefined,
  id: undefined,

  setName: (value) => set({ name: value }),
  setSurname: (value) => set({ surname: value }),
  setEmail: (value) => set({ email: value }),
  setPhone: (value) => set({ phone: value }),
  setPassword: (value) => set({ password: value }),
  setBirthday: (value) => set({ birthday: value }),
  setId: (value) => set({ id: value }),

  setUser: (user) => {
    if (user) {
      set({
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        birthday: new Date(user.birthday),
        id: user.id,
      });
    } else {
      set({
        name: "",
        surname: "",
        email: "",
        phone: "",
        password: "",
        birthday: undefined,
        id: undefined,
      });
    }
  },

  resetUser: () =>
    set({
      name: "",
      surname: "",
      email: "",
      phone: "",
      password: "",
      birthday: undefined,
      id: undefined,
    }),
}));
