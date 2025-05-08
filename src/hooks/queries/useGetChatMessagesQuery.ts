import { useQuery } from '@tanstack/react-query';
import { getChatMessages } from '@/services/chat';

export const useGetChatMessagesQuery = (
  chatRoomId: string,
  userId: string | null
) => {
  return useQuery({
    queryKey: ['chatMessages', chatRoomId, userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('사용자 ID가 필요합니다.');
      }
      return getChatMessages(chatRoomId, userId);
    },
    enabled: Boolean(chatRoomId) && Boolean(userId),
    retry: false,
  });
};
