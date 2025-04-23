// src/services/notification.ts
import axios from 'axios';

// src/services/notification.ts

export interface Notification {
    id: number;
    type: string;
    message: string;
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
      const response = await axios.get('/api/notification');
      return response.data;
    } catch (error) {
      console.error('알림을 불러오는 중 오류가 발생했습니다:', error);
      throw error;
    }
  };
  
  // 알림 전송
  export const sendNotification = async (notificationPayload: NotificationPayload) => {
    try {
      const response = await axios.post('/api/notifications', notificationPayload);
      return response.data;
    } catch (error) {
      console.error('알림 전송 실패:', error);
      throw error;
    }
  };
  
