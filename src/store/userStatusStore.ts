import { create } from 'zustand';
import { socket } from '@/lib/socket';
import { UserStatus, UserStatusState } from '@/types/userStatus.type';

// 현재 로그인한 사용자 ID를 가져오는 함수
const getCurrentUserId = (): string | null => {
  try {
    // 실제 저장 방식에 따라 수정 필요
    const userInfo = localStorage.getItem('user_info');
    if (!userInfo) return null;

    const parsed = JSON.parse(userInfo);
    return parsed.id || null;
  } catch (e) {
    console.error('Failed to get current user ID', e);
    return null;
  }
};

export const useUserStatusStore = create<UserStatusState>((set, get) => ({
  userStatuses: {},

  updateUserStatuses: (statuses) => {
    const newStatuses = statuses.reduce(
      (acc, { userId, isActive }) => {
        acc[userId] = isActive;
        return acc;
      },
      {} as Record<string, boolean>
    );

    // 현재 사용자는 항상 온라인으로 표시
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
      newStatuses[currentUserId] = true;
    }

    set((state) => ({
      userStatuses: { ...state.userStatuses, ...newStatuses },
    }));
  },

  fetchUserStatuses: (userIds) => {
    if (userIds.length === 0) return;

    // 현재 사용자를 온라인으로 표시
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
      get().updateUserStatuses([{ userId: currentUserId, isActive: true }]);
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('get:user:status', { userIds });
  },

  initSocketListeners: () => {
    // 이미 리스너가 등록되어 있으면 중복 등록 방지를 위해 제거
    socket.off('userStatus');

    // 새로운 리스너 등록
    socket.on('userStatus', (statuses: UserStatus[]) => {
      get().updateUserStatuses(statuses);
    });

    // 소켓 연결이 끊어지면 다시 연결
    socket.on('disconnect', () => {
      const userIds = Object.keys(get().userStatuses);
      if (userIds.length > 0 && !socket.connected) {
        socket.connect();
        setTimeout(() => {
          get().fetchUserStatuses(userIds);
        }, 1000);
      }
    });

    // 연결 직후 자신의 상태 업데이트
    socket.on('connect', () => {
      const currentUserId = getCurrentUserId();
      if (currentUserId) {
        get().updateUserStatuses([{ userId: currentUserId, isActive: true }]);
      }
    });
  },
}));

let updateInterval: NodeJS.Timeout | null = null;

export const startStatusUpdates = () => {
  if (updateInterval) return;

  // 소켓 리스너 초기화
  useUserStatusStore.getState().initSocketListeners();

  // 주기적으로 상태 업데이트
  updateInterval = setInterval(() => {
    const userIds = Object.keys(useUserStatusStore.getState().userStatuses);
    if (userIds.length > 0) {
      useUserStatusStore.getState().fetchUserStatuses(userIds);
    }
  }, 30000);
};

export const stopStatusUpdates = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
};
