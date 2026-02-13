import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  hotelId: string | null;
  role: string | null;
  user: any | null;
  selectedHotelName: string | null;
  setAuth: (data: { token: string; role: string; user?: any }) => void;
  setHotel: (id: string, name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      hotelId: null,
      role: null,
      user: null,
      selectedHotelName: null,

      setAuth: (data) =>
        set({
          token: data.token,
          role: data.role,
          user: data.user || null,
        }),

      setHotel: (id, name) =>
        set({
          hotelId: id,
          selectedHotelName: name,
        }),

      logout: () =>
        set({
          token: null,
          hotelId: null,
          role: null,
          user: null,
          selectedHotelName: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // No need for onRehydrateStorage since setHydrated does not exist
    },
  ),
);
