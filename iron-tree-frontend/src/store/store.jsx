import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTheme = create(
  persist(
    (set) => ({
      dark: false,
      toggleTheme: () =>
        set((state) => ({
          dark: !state.dark,
        })),
    }),
    {
      name: "theme",
    }
  )
);

export const happyMode = create(
  persist(
    (set) => ({
      happy: false,
      toggleHappy: () =>
        set((state) => ({
          happy: !state.happy,
        })),
    }),
    {
      name: "happy",
    }
  )
);

export const useTabs = create(
  persist(
    (set) => ({
      tabs: [
        {
          label: "工作台",
          path: "/admin",
        },
      ],
      setTabs: (data) =>
        set((state) => {
          let isOk = false;
          for (let i = 0; i < state.tabs.length; i++) {
            if (state.tabs[i].label === data.label) {
              isOk = true;
              break;
            }
          }
          console.log({ isOk });
          if (isOk) {
            return { tabs: state.tabs };
          } else {
            return {
              tabs: [...state.tabs, data],
            };
          }
        }),
      delTabs: (index) =>
        set((state) => ({
          tabs: state.tabs.splice(index, 1),
        })),
    }),
    {
      name: "tabs",
    }
  )
);
