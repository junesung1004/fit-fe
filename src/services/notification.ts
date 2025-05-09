import instance from '@/lib/axios';

export interface Notification {
  id: number;
  type: string;
  title: string;
  content: string;
  senderId: number;
  createdAt: string;
}

export interface NotificationPayload {
  receiverId: string;
  type: string;
  title: string;
  content: string;
}

// ✅ 알림 목록 불러오기 (HTTP)
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await instance.get('/notification');
    return response.data;
  } catch (error) {
    console.error('알림을 불러오는 중 오류가 발생했습니다:', error);
    throw error;
  }
};

// ✅ 알림 전송 (HTTP)
export const sendNotification = async (
  notificationPayload: NotificationPayload
) => {
  try {
    const response = await instance.post('/notification', notificationPayload);
    return response.data;
  } catch (error) {
    console.error('알림 전송 실패:', error);
    throw error;
  }
};

// ✅ 알림 전송 (SSE)
export const sendSseNotification = async (
  userId: string,
  payload: {
    type: string;
    title: string;
    content: string;
  }
) => {
  try {
    const response = await instance.post(`/sse/send/${userId}`, payload);
    return response.data;
  } catch (error) {
    console.error('SSE 알림 전송 실패:', error);
    throw error;
  }
};

// ✅ 알림 하나 삭제
export const deleteNotification = async (id: number) => {
  try {
    const response = await instance.delete(`/notification/${id}`);
    return response.data;
  } catch (error) {
    console.error('알림 삭제 실패:', error);
    throw error;
  }
};

// ✅ 전체 알림 삭제
export const deleteAllNotifications = async () => {
  try {
    const response = await instance.delete('/notification');
    return response.data;
  } catch (error) {
    console.error('전체 알림 삭제 실패:', error);
    throw error;
  }
};
