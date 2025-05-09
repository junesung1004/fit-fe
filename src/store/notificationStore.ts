import { create } from 'zustand';
import { Notification } from '@/types/notification.type';

/* eslint-disable no-unused-vars */
interface NotificationState {
  notifications: Notification[];
  hasNew: boolean;
  addNotification: (notification: Notification) => void;
  clearNewStatus: () => void;
}
/* eslint-enable no-unused-vars */

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  hasNew: false,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      hasNew: true,
    })),
  clearNewStatus: () => set({ hasNew: false }),
}));
