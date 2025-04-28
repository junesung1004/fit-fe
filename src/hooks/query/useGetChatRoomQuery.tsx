import { getDatingChat } from '@/services/chat';
import { useQuery } from '@tanstack/react-query';

export const useGetChatRoomQuery = () => {
  return useQuery({
    queryKey: ['datingChatList'],
    queryFn: getDatingChat,
  });
};
