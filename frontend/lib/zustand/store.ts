import { create } from "zustand";

interface ChangeToastStore {
  message: string;
  type: "success" | "error" | null;
  isOpen: boolean;

  show: (msg: string, type?: "success" | "error") => void;
  hide: () => void;
}

export const useToastStore = create<ChangeToastStore>((set) => ({
  message: "",
  type: null,
  isOpen: false,


  show: (msg, type = "success") => set({ message: msg, type, isOpen: true }),
  hide: () => set({ isOpen: false }),
}));