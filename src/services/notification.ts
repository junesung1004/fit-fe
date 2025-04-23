import axios from 'axios';

export interface Notification {
    id: number;
    type: string;
    title: string,
    content: string,
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
      const response = await axios.get('/notification');
      return response.data;
    } catch (error) {
      console.error('알림을 불러오는 중 오류가 발생했습니다:', error);
      throw error;
    }
  };
  
  // 알림 전송
  export const sendNotification = async (notificationPayload: NotificationPayload) => {
    try {
      const response = await axios.post('/notification', notificationPayload);
      return response.data;
    } catch (error) {
      console.error('알림 전송 실패:', error);
      throw error;
    }
  };
  
// 실시간 알림을 받는 함수 (SSE 사용)
// eslint-disable-next-line no-unused-vars
export const listenToRealTimeNotifications = (callback: (notification: Notification) => void) => {
  const eventSource = new EventSource('/notification/events'); // 서버에서 SSE 스트림을 제공하는 URL

  eventSource.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    callback(notification); // 알림을 받아서 콜백 함수로 전달
  };

  eventSource.onerror = (error) => {
    console.error('SSE 오류 발생:', error);
  };

  // 컴포넌트 언마운트 시 스트림 종료
  return () => {
    eventSource.close();
  };
};