import { create } from 'zustand';
import { userStatusSocket } from '@/lib/socket';
import { UserStatus, UserStatusState } from '@/types/userStatus.type';

const STATUS_UPDATE_INTERVAL = 10000;
let updateInterval: NodeJS.Timeout | null = null;
let isUpdating = false;

// 현재 사용자 ID 조회
const getCurrentUserId = (): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    return JSON.parse(authStorage)?.state?.user?.id || null;
  } catch (e) {
    console.error('사용자 ID 조회 실패:', e);
    return null;
  }
};

export const useUserStatusStore = create<UserStatusState>((set, get) => ({
  userStatuses: {},

  updateUserStatuses: (statuses) => {
    if (!statuses.length) return;
    const newStatuses = statuses.reduce(
      (acc, { userId, isActive }) => {
        acc[userId] = isActive;
        return acc;
      },
      {} as Record<string, boolean>
    );
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
      newStatuses[currentUserId] = true;
    }
    set((state) => ({
      userStatuses: { ...state.userStatuses, ...newStatuses },
    }));
  },

  fetchUserStatuses: (userIds) => {
    if (userIds.length === 0 || isUpdating) return;
    try {
      isUpdating = true;
      const currentUserId = getCurrentUserId();
      const currentState = get();
      if (currentUserId && !currentState.userStatuses[currentUserId]) {
        set((state) => ({
          userStatuses: { ...state.userStatuses, [currentUserId]: true },
        }));
      }
      if (!userStatusSocket.connected) {
        userStatusSocket.connect();
      }
      userStatusSocket.emit('get:user:status', { userIds });
    } catch (error) {
      console.error('사용자 상태 조회 실패:', error);
    } finally {
      isUpdating = false;
    }
  },

  initSocketListeners: () => {
    userStatusSocket.off('userStatus');
    userStatusSocket.off('disconnect');
    userStatusSocket.off('connect');
    userStatusSocket.off('connect_error');

    userStatusSocket.on('userStatus', (statuses: UserStatus[]) => {
      console.log('사용자 상태 업데이트 수신:', statuses);
      get().updateUserStatuses(statuses);
    });
    userStatusSocket.on('disconnect', () => {
      console.log('소켓 연결이 끊어졌습니다.');
    });
    userStatusSocket.on('connect', () => {
      console.log('소켓이 연결되었습니다.');
      const currentUserId = getCurrentUserId();
      if (currentUserId) {
        set((state) => ({
          userStatuses: { ...state.userStatuses, [currentUserId]: true },
        }));
      }
    });
    userStatusSocket.on('connect_error', (err) => {
      console.error('소켓 연결 에러:', err);
    });
  },
}));

export const startStatusUpdates = () => {
  if (typeof window === 'undefined' || updateInterval) return;
  useUserStatusStore.getState().initSocketListeners();
  updateInterval = setInterval(() => {
    const userIds = Object.keys(useUserStatusStore.getState().userStatuses);
    if (userIds.length > 0) {
      useUserStatusStore.getState().fetchUserStatuses(userIds);
    }
  }, STATUS_UPDATE_INTERVAL);
};

export const stopStatusUpdates = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
  isUpdating = false;
};
