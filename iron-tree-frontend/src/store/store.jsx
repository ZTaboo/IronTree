import {create} from "zustand";
import {persist} from "zustand/middleware";

export const useTheme = create(persist((set) => ({
    dark: false, toggleTheme: () => set((state) => ({
        dark: !state.dark,
    })),
}), {
    name: "theme",
}));

export const happyMode = create(persist((set) => ({
    happy: false, toggleHappy: () => set((state) => ({
        happy: !state.happy,
    })),
}), {
    name: "happy",
}));

export const useTabs = create(persist((set) => ({
    tabs: [{
        label: "工作台", path: "/admin",
    },], setTabs: (data) => set((state) => {
        let isOk = false;
        for (let i = 0; i < state.tabs.length; i++) {
            if (state.tabs[i].label === data.label) {
                isOk = true;
                break;
            }
        }
        if (isOk) {
            return {tabs: state.tabs};
        } else {
            return {
                tabs: [...state.tabs, data],
            };
        }
    }), delTabs: (index) => set((state) => {
        let tmpTabs = [...state.tabs];
        tmpTabs.splice(index, 1)
        return ({
            tabs: tmpTabs,
        })
    }), // 关闭全部标签
    delAllTabs: () => set(() => ({
        tabs: [{
            label: "工作台", path: "/admin",
        }],
    })), // 关闭其它tab
    delOtherTabs: (data) => {
        set((state) => ({
            tabs: data.path === "/admin" ? [{
                label: "工作台", path: "/admin",
            }] : [{
                label: "工作台", path: "/admin",
            }, data],
        }))
    }, //     关闭指定方向全部tab
    delDirectionTabs: (index, direction) => {
        switch (direction) {
            case 'left':
                set((state) => ({
                    tabs: [{
                        label: "工作台", path: "/admin",
                    }, ...state.tabs.slice(index)]
                }))
                return
            default:
                set((state) => {
                    let newList = [...state.tabs]
                    newList.splice(index + 1)
                    return {
                        tabs: index === 0 ? [{
                            label: "工作台", path: "/admin",
                        }] : [...newList]
                    }
                })
                return;
        }
    }

}), {
    name: "tabs",
}));
