export interface UserStatus {
  userId: string;
  isActive: boolean;
}

export interface UserStatusPayload {
  userIds: string[];
}

export interface UserStatusState {
  userStatuses: Record<string, boolean>;
  // eslint-disable-next-line no-unused-vars
  updateUserStatuses: (statuses: UserStatus[]) => void;
  // eslint-disable-next-line no-unused-vars
  fetchUserStatuses: (userIds: string[]) => void;
  initSocketListeners: () => void;
}
