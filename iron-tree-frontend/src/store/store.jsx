import {create} from "zustand";
import {persist} from 'zustand/middleware'

export const useTheme = create(persist(
    (set) => ({
        dark: true,
        toggleTheme: () => set((state) => ({
            dark: !state.dark
        })),
    }),
    {
        name: 'theme',
    }
))