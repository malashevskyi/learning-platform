import { create } from "zustand";

interface RedirectStore {
  pendingRedirect: string | null;
  setPendingRedirect: (path: string | null) => void;
  clearPendingRedirect: () => void;
}

export const useRedirectStore = create<RedirectStore>((set) => ({
  pendingRedirect: null,

  setPendingRedirect: (path: string | null) => {
    set({ pendingRedirect: path });
  },

  clearPendingRedirect: () => {
    set({ pendingRedirect: null });
  },
}));
