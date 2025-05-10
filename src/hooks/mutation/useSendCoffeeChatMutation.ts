import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendCoffeeChat } from '@/services/chat';
import { CoffeeChatRequest } from '@/services/chat';

export const useSendCoffeeChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CoffeeChatRequest) => sendCoffeeChat(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coffeeCount'] });
    },
  });
};
