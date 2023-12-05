import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StateType {
  activeDir?: string | any;
  activeTheme?: string; // BLUE_THEME, GREEN_THEME, BLACK_THEME, PURPLE_THEME, ORANGE_THEME
  SidebarWidth?: number;
  MiniSidebarWidth?: number;
  TopbarHeight?: number;
  isCollapse?: boolean;
  isLayout?: string;
  isSidebarHover?: boolean;
  isMobileSidebar?: boolean;
  isHorizontal?: boolean;
  isLanguage?: string;
  isCardShadow?: boolean;
  borderRadius?: number | any;
  setLanguage: (language: string) => void;
  toggleSidebar: () => void;
  hoverSidebar: (value: boolean) => void;
  toggleMobileSidebar: () => void;
  toggleLayout: (layout: string) => void;
}

export const useCustomizerStore = create<StateType>()(
  persist(
    (set) => ({
      activeDir: "ltr",
      activeTheme: "BLUE_THEME",
      SidebarWidth: 270,
      MiniSidebarWidth: 87,
      TopbarHeight: 70,
      isLayout: "full",
      isCollapse: false,
      isSidebarHover: false,
      isMobileSidebar: false,
      isHorizontal: false,
      isLanguage: localStorage.getItem("my_benefit_lang") ?? "bs",
      isCardShadow: true,
      borderRadius: 7,
      setLanguage: (language: string) => {
        localStorage.setItem("my_benefit_lang", language);
        set(() => ({ isLanguage: language }));
      },
      toggleSidebar: () => set((state) => ({ isCollapse: !state.isCollapse })),
      hoverSidebar: (value: boolean) => set(() => ({ isSidebarHover: value })),
      toggleMobileSidebar: () =>
        set((state) => ({ isMobileSidebar: !state.isMobileSidebar })),
      toggleLayout: (layout: string) => set(() => ({ isLayout: layout })),
    }),
    { name: "customizer-storage" }
  )
);
