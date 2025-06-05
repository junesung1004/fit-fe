import { useQuery } from '@tanstack/react-query';
import { getDatingChat } from '@/services/chat';
import { ChatRoomType } from '@/types/chats.type';

export const useGetChatRoomQuery = () => {
  return useQuery<ChatRoomType[]>({
    queryKey: ['chatRooms'],
    queryFn: async () => {
      const response = await getDatingChat();
      return response.rooms;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
