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
  senderId: number;
  receiverId: number;
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
export const sendNotification = async (notificationPayload: NotificationPayload) => {
  try {
    const response = await instance.post('/notification', notificationPayload);
    return response.data;
  } catch (error) {
    console.error('알림 전송 실패:', error);
    throw error;
  }
};

// 실시간 알림을 받는 함수 (SSE 사용)
// eslint-disable-next-line no-unused-vars
export const listenToRealTimeNotifications = (callback: (notification: Notification) => void) => {
  const eventSource = new EventSource('https://api.fit-date.co.kr/api/v1/notification/events'); 
  // ⚠️ SSE는 axios 인스턴스를 못 써서 직접 전체 URL 명시 필요!

  eventSource.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    callback(notification); // 알림을 받아서 콜백 함수로 전달
  };

  eventSource.onerror = (error) => {
    console.error('SSE 오류 발생:', error);
  };

  return () => {
    eventSource.close();
  };
};
