import { useQuery } from '@tanstack/react-query';
import { getChatMessages } from '@/services/chat';

export const useGetChatMessagesQuery = (
  chatRoomId: string,
  userId: string | null
) => {
  console.log('useGetChatMessagesQuery params:', { chatRoomId, userId });

  return useQuery({
    queryKey: ['chatMessages', chatRoomId, userId],
    queryFn: () => {
      console.log('Fetching chat messages...');
      return getChatMessages(chatRoomId, userId!);
    },
    enabled: Boolean(chatRoomId) && Boolean(userId),
  });
};
