import { KsGraphNode } from "@api/ksGraph/ksGraph";
import { create } from "zustand";

export interface KsGraphNodeModalState {
  item?: KsGraphNode;
  isOpen: boolean;
  isCreate: boolean;
  openModal: (item: KsGraphNode, isCreate: boolean) => void;
  closeModal: () => void;
}

export const useKsGraphNodeModalStore = create<KsGraphNodeModalState>(
  (set) => ({
    item: undefined,
    isOpen: false,
    isCreate: true,
    openModal: (item, isCreate) =>
      set(() => ({ item, isOpen: true, isCreate })),
    closeModal: () =>
      set(() => ({
        item: undefined,
        isOpen: false,
      })),
  })
);
