import { create } from "zustand";

interface UserUpdateStore {
  needsUpdate: boolean;
  setNeedsUpdate: (value: boolean) => void;
}

export const useUserUpdateStore = create<UserUpdateStore>((set) => ({
  needsUpdate: false,
  setNeedsUpdate: (value) => set({ needsUpdate: value }),
}));
