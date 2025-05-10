import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchLoggedInFilteredUsers,
  fetchPublicFilteredUsers,
} from '@/services/memeber';
import { useAuthStore } from '@/store/authStore';
import { FilterParams } from '@/types/member.type';

export const useFilterUsersMutation = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filter: FilterParams) =>
      isLoggedIn
        ? fetchLoggedInFilteredUsers(filter)
        : fetchPublicFilteredUsers(filter),
    onSuccess: (data) => {
      queryClient.setQueryData(['users', isLoggedIn], data);
    },
  });
};
