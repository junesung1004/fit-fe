import instance from '@/lib/axios';
import { AxiosError } from 'axios';
import { ChatRoomResponse } from '@/types/chats.type';

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

export const getChatRoomData = async (partnerId: string) => {
  try {
    const response = await instance.post(
      `chat/chatRooms/findOrCreate/${partnerId}`
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<TodayDatingMatch>;
    console.error('채팅방 룸 입장장 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
  }
};

export const getChatMessages = async (
  chatRoomId: string,
  userId: string
): Promise<ChatRoomResponse> => {
  console.log('getChatMessages called with:', { chatRoomId, userId });
  try {
    const response = await instance.get<ChatRoomResponse>(
      `/chat/chatRooms/${chatRoomId}/messages`,
      {
        params: { userId },
      }
    );
    console.log('getChatMessages response:', response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error('❌ 채팅방 메시지 조회 실패:', err);
    throw err;
  }
};
