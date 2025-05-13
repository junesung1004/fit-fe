import { create } from 'zustand';
import { userStatusSocket } from '@/lib/socket';
import { UserStatus, UserStatusState } from '@/types/userStatus.type';
import { createDebouncer } from '@/hooks/operators/useDebounce';
import { isAxiosError } from '@/lib/error';

const STATUS_UPDATE_INTERVAL = 60000;
let updateInterval: NodeJS.Timeout | null = null;
let isUpdating = false;

const statusDebouncer = createDebouncer<UserStatus>(5000);

// 현재 사용자 ID 조회
const getCurrentUserId = (): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    return JSON.parse(authStorage)?.state?.user?.id || null;
  } catch {
    return null;
  }
};

// 사용자 상태 저장
export const useUserStatusStore = create<UserStatusState>((set, get) => ({
  userStatuses: {},
  socketError: null,

  updateUserStatuses: (statuses) => {
    if (!statuses.length) return;

    statuses.forEach((status) => {
      statusDebouncer.add((allStatuses) => {
        const newStatuses = allStatuses.reduce(
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

        set({ userStatuses: newStatuses });
      }, status);
    });
  },

  // 사용자 상태 조회
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
      set({ socketError: null });
    } catch (error) {
      if (isAxiosError(error)) {
        set({
          socketError:
            error.response?.data?.message || '사용자 상태 조회에 실패했습니다.',
        });
      } else {
        set({ socketError: '사용자 상태 조회에 실패했습니다.' });
      }
    } finally {
      isUpdating = false;
    }
  },

  // 소켓 이벤트 초기화 및 리스너 설정
  initSocketListeners: () => {
    userStatusSocket.off('userStatus');
    userStatusSocket.off('disconnect');
    userStatusSocket.off('connect');
    userStatusSocket.off('connect_error');

    userStatusSocket.on('userStatus', (statuses: UserStatus[]) => {
      get().updateUserStatuses(statuses);
    });

    userStatusSocket.on('disconnect', () => {
      set({ socketError: '소켓 연결이 끊어졌습니다.' });
    });

    userStatusSocket.on('connect', () => {
      const currentUserId = getCurrentUserId();
      if (currentUserId) {
        set((state) => ({
          userStatuses: { ...state.userStatuses, [currentUserId]: true },
          socketError: null,
        }));
      }
    });

    userStatusSocket.on('connect_error', () => {
      set({ socketError: '소켓 연결에 실패했습니다.' });
    });
  },

  setSocketError: (error: string | null) => set({ socketError: error }),
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
  statusDebouncer.cancel();
};
