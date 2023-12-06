import {create} from "zustand";
import {persist} from 'zustand/middleware'

export const useTheme = create(persist(
    (set) => ({
        dark: false,
        toggleTheme: () => set((state) => ({
            dark: !state.dark
        })),
    }),
    {
        name: 'theme',
    }
))

export const happyMode = create(persist(
    (set) => ({
        happy: false,
        toggleHappy: () => set((state) => ({
            happy: !state.happy
        })),
    }),
    {
        name: 'happy',
    }
))