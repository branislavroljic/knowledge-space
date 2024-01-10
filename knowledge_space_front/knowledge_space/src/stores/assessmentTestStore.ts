import { AssessmentTest } from "@api/assessmentTest/assessementTest";
import { AxiosResponse } from "axios";
import { create } from "zustand";

export interface AssessmentTestModalState {
  item?: AssessmentTest;
  isOpen: boolean;
  shouldClose: boolean;
  setItem: (item: AssessmentTest) => void;
  submitAction?: (
    item: AssessmentTest
  ) => Promise<AxiosResponse<any, any>>;
  openModal: (
    item: AssessmentTest,
    submitAction: (
      item: AssessmentTest
    ) => Promise<AxiosResponse<any, any>>,
    shouldClose: boolean
  ) => void;
  closeModal: () => void;
}

export const useAssessmentTestModalStore = create<AssessmentTestModalState>(
  (set) => ({
    item: undefined,
    isOpen: false,
    shouldClose: false,
    isUpdate: false,
    setItem: (item) => set(() => ({ item })),
    submitAction: undefined,
    openModal: (item, submitAction, shouldClose) =>
      set(() => ({
        item,
        isOpen: true,
        submitAction,
        shouldClose,
      })),
    closeModal: () =>
      set(() => ({
        item: undefined,
        isOpen: false,
        submitAction: undefined,
        submitWorkingHoursAction: undefined,
        shouldClose: false,
      })),
  })
);
