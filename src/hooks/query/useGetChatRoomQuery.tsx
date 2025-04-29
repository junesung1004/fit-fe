import { getChatMessageData, getDatingChat } from '@/services/chat';
import { useQuery } from '@tanstack/react-query';

export const useGetChatRoomQuery = () => {
  return useQuery({
    queryKey: ['datingChatList'],
    queryFn: getDatingChat,
  });
};

export const useGetChatMessageQuery = (chatRoomId: string) => {
  return useQuery({
    queryKey: ['chatMessages', chatRoomId],
    queryFn: () => getChatMessageData(chatRoomId),
    enabled: !!chatRoomId, // chatRoomId가 있어야 실행됨
  });
};
