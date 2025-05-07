import { useQuery } from '@tanstack/react-query';
import { getDatingChat } from '@/services/chat';
import { ChatRoomType } from '@/types/chats.type';

export const useGetChatRoomQuery = () => {
  return useQuery<ChatRoomType[]>({
    queryKey: ['chatRooms'],
    queryFn: getDatingChat,
  });
};
