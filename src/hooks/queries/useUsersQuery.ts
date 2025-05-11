import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLoggedInUsers, fetchPublicUsers } from '@/services/memeber';
import { useAuthStore } from '@/store/authStore';
import { UsersQueryParams, FilteredUsersResponse } from '@/types/member.type';

export const useUsersQuery = (params?: UsersQueryParams) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const take = params?.take ?? 6;

  return useInfiniteQuery({
    queryKey: ['users', isLoggedIn, params],
    queryFn: async ({ pageParam = null }): Promise<FilteredUsersResponse> => {
      const response = isLoggedIn
        ? await fetchLoggedInUsers({ ...params, cursor: pageParam, take })
        : await fetchPublicUsers({ ...params, cursor: pageParam, take });
      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null as string | null,
  });
};
