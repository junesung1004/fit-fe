import { useQuery } from '@tanstack/react-query';
import { getChatMessages } from '@/services/chat';

export const useChatMessages = (chatRoomId: string, userId: string | null) => {
  return useQuery({
    queryKey: ['chatMessages', chatRoomId, userId],
    queryFn: () => getChatMessages(chatRoomId, userId!),
    enabled: !!chatRoomId && !!userId,
  });
};
