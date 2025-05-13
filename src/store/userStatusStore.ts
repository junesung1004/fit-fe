import { create } from 'zustand';
import { userStatusSocket, setUserStatusSocketToken } from '@/lib/socket';
import { UserStatus, UserStatusState } from '@/types/userStatus.type';

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 5000;
const STATUS_UPDATE_INTERVAL = 10000;

// 전역 상태 관리
let reconnectAttempts = 0;
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

// 현재 사용자 토큰 조회
const getCurrentUserToken = (): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    return JSON.parse(authStorage)?.state?.token || null;
  } catch (e) {
    console.error('토큰 조회 실패:', e);
    return null;
  }
};

// 상태 업데이트 최적화를 위한 함수
const updateUserStatus = (
  currentStatuses: Record<string, boolean>,
  newStatuses: Record<string, boolean>
): Record<string, boolean> => {
  const hasChanges = Object.entries(newStatuses).some(
    ([userId, isActive]) => currentStatuses[userId] !== isActive
  );

  if (!hasChanges) return currentStatuses;

  return { ...currentStatuses, ...newStatuses };
};

// 사용자 상태 업데이트 함수
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
      userStatuses: updateUserStatus(state.userStatuses, newStatuses),
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

      const token = getCurrentUserToken();
      setUserStatusSocketToken(token || '');

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
    // 기존 리스너 제거
    userStatusSocket.off('userStatus');
    userStatusSocket.off('disconnect');
    userStatusSocket.off('connect');
    userStatusSocket.off('connect_error');

    // 새로운 리스너 등록
    userStatusSocket.on('userStatus', (statuses: UserStatus[]) => {
      console.log('사용자 상태 업데이트 수신:', statuses);
      get().updateUserStatuses(statuses);
    });

    userStatusSocket.on('disconnect', () => {
      console.log('소켓 연결이 끊어졌습니다. 재연결을 시도합니다.');
      const userIds = Object.keys(get().userStatuses);

      if (userIds.length > 0 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        const token = getCurrentUserToken();
        reconnectAttempts++;
        console.log(
          `재연결 시도 ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`
        );

        setUserStatusSocketToken(token || '');
        userStatusSocket.connect();

        setTimeout(() => {
          get().fetchUserStatuses(userIds);
        }, RECONNECT_DELAY);
      } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('최대 재연결 시도 횟수를 초과했습니다.');
        stopStatusUpdates();
      }
    });

    userStatusSocket.on('connect', () => {
      console.log('소켓이 연결되었습니다.');
      reconnectAttempts = 0;
      const currentUserId = getCurrentUserId();
      if (currentUserId) {
        set((state) => ({
          userStatuses: { ...state.userStatuses, [currentUserId]: true },
        }));
      }
    });

    userStatusSocket.on('connect_error', (err) => {
      console.error('소켓 연결 에러:', err);
      if (
        err.message === 'No token provided' &&
        reconnectAttempts < MAX_RECONNECT_ATTEMPTS
      ) {
        const token = getCurrentUserToken();
        reconnectAttempts++;
        console.log(
          `재연결 시도 ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`
        );

        setUserStatusSocketToken(token || '');
        userStatusSocket.connect();
      } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('최대 재연결 시도 횟수를 초과했습니다.');
        stopStatusUpdates();
      }
    });
  },
}));

// 사용자 상태 업데이트 시작
export const startStatusUpdates = () => {
  if (typeof window === 'undefined' || updateInterval) return;

  const token = getCurrentUserToken();
  if (token) {
    setUserStatusSocketToken(token);
  }

  useUserStatusStore.getState().initSocketListeners();

  updateInterval = setInterval(() => {
    const userIds = Object.keys(useUserStatusStore.getState().userStatuses);
    if (userIds.length > 0) {
      useUserStatusStore.getState().fetchUserStatuses(userIds);
    }
  }, STATUS_UPDATE_INTERVAL);
};

// 사용자 상태 업데이트 중지
export const stopStatusUpdates = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
  isUpdating = false;
  reconnectAttempts = 0;
};

// 사용자 상태 소켓 재연결
export function reconnectUserStatusSocket(newToken: string) {
  console.log('소켓 재연결 시도');
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('최대 재연결 시도 횟수를 초과했습니다.');
    return;
  }

  if (userStatusSocket.connected) {
    userStatusSocket.disconnect();
  }

  reconnectAttempts++;
  console.log(`재연결 시도 ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
  setUserStatusSocketToken(newToken);
  userStatusSocket.connect();
}
