import instance from '@/lib/axios';
import { AxiosError } from 'axios';

interface TodayDatingMatch {
  message: string;
  errorCode?: string;
}

export const getDatingChat = async () => {
  try {
    const response = await instance.get('/chat/chatRooms');
    return response.data;
  } catch (error) {
    const err = error as AxiosError<TodayDatingMatch>;
    console.error('채팅방 리스트 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
  }
};
