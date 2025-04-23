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

// 알림 목록 불러오기
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await instance.get('/notification');
    return response.data;
  } catch (error) {
    console.error('알림을 불러오는 중 오류가 발생했습니다:', error);
    throw error;
  }
};

// 알림 전송
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

// 알림 하나 삭제
export const deleteNotification = async (id: number) => {
  try {
    const response = await instance.delete(`/notification/${id}`);
    return response.data;
  } catch (error) {
    console.error('알림 삭제 실패:', error);
    throw error;
  }
};

// 전체 알림 삭제 (Id 불필요)
export const deleteAllNotifications = async () => {
  try {
    const response = await instance.delete('/notification');
    return response.data;
  } catch (error) {
    console.error('전체 알림 삭제 실패:', error);
    throw error;
  }
};

// 실시간 알림 받기 (SSE)
 
export const listenToRealTimeNotifications = (
  // eslint-disable-next-line no-unused-vars
  callback: (notification: Notification) => void
) => {
  const eventSource = new EventSource(
    'https://api.fit-date.co.kr/api/v1/notification/events'
  );

  eventSource.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    callback(notification);
  };

  eventSource.onerror = (error) => {
    console.error('SSE 오류 발생:', error);
  };

  return () => {
    eventSource.close();
  };
};
