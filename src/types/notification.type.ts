export interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  data: Record<string, unknown>;
}

export interface CreateNotificationPayload {
  receiverId: string;
  type: string;
  title: string;
  content: string;
  data?: Record<string, unknown>;
}
