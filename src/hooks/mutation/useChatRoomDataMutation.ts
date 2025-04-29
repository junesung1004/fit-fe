import { useMutation } from '@tanstack/react-query';
import { getChatRoomData } from '@/services/chat';

export const useGetChatRoomDataMutation = () => {
  return useMutation({
    mutationFn: (partnerId: string) => getChatRoomData(partnerId),
  });
};
