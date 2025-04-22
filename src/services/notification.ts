import axios from 'axios';

interface NotificationRequest {
  receiverId: number;
  type: string;
  title: string;
  content: string;
}

export const sendNotification = async (payload: NotificationRequest) => {
  return await axios.post('/api/notifications', payload);
};
