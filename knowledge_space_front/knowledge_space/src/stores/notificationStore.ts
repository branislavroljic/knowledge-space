import { create } from 'zustand';

export interface NotificationData {
  primaryText: string;
  secondaryText?: string;
  isError?: boolean;
}

export interface NotificationState {
  isOpen: boolean;
  data: NotificationData;
  openNotification: (data: NotificationData) => void;
  closeNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  isOpen: false,
  data: {} as NotificationData,
  openNotification: (data) => set(() => ({ isOpen: true, data })),
  closeNotification: () =>
    set(() => ({ isOpen: false, data: {} as NotificationData })),
}));

