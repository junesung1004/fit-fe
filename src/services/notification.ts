import instance from '@/lib/axios';
import {
  Notification,
  CreateNotificationPayload,
} from '@/types/notification.type';

// ✅ SSE 알림 스트림 연결
export const connectNotificationStream = (userId: string): EventSource => {
  return new EventSource(
    `https://api.fit-date.co.kr/api/v1/notification/stream/${userId}`,
    {
      withCredentials: true,
    }
  );
};

// ✅ 알림 목록 불러오기
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await instance.get(`/notification`);
    return response.data;
  } catch (error) {
    console.error('알림을 불러오는 중 오류가 발생했습니다:', error);
    throw error;
  }
};

// ✅ 알림 생성
export const createNotification = async (
  payload: CreateNotificationPayload
) => {
  try {
    const response = await instance.post('/notification', payload);
    return response.data;
  } catch (error) {
    console.error('알림 생성 실패:', error);
    throw error;
  }
};

// ✅ 실시간 알림 전송 (SSE)
export const sendNotification = async (
  userId: string,
  payload: Omit<CreateNotificationPayload, 'receiverId'>
) => {
  try {
    const response = await instance.post(
      `/notification/stream/${userId}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('실시간 알림 전송 실패:', error);
    throw error;
  }
};

// ✅ 알림 읽음 처리
export const markNotificationAsRead = async (id: string) => {
  try {
    const response = await instance.post(`/notification/${id}/read`);
    return response.data;
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error);
    throw error;
  }
};

// ✅ 알림 하나 삭제
export const deleteNotification = async (id: string) => {
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
    const response = await instance.delete(`/notification`);
    return response.data;
  } catch (error) {
    console.error('전체 알림 삭제 실패:', error);
    throw error;
  }
};
