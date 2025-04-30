import instance from '@/lib/axios';
import { AxiosError } from 'axios';

interface TodayDatingMatch {
  message: string;
  errorCode?: string;
}

interface Partner {
  id: string;
  profileImage: string;
}

interface Message {
  id: string;
  content: string;
  userId: string;
  chatRoomId: string;
  createdAt: string; // ISO string
}

interface ChatRoomResponse {
  chatRoomId: string;
  partner: Partner;
  messages: Message[];
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

export const getChatMessageData = async (
  chatRoomId: string
): Promise<ChatRoomResponse> => {
  try {
    const response = await instance.get(
      `/chat/chatRooms/${chatRoomId}/messages`
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error('❌ 채팅방 메시지 가져오기 실패:', err);
    throw err;
  }
};
