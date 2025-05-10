import { useQuery } from '@tanstack/react-query';
import { fetchLoggedInUsers, fetchPublicUsers } from '@/services/memeber';
import { useAuthStore } from '@/store/authStore';
import { UsersQueryParams } from '@/types/member.type';

export const useUsersQuery = (params?: UsersQueryParams) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ['users', isLoggedIn, params],
    queryFn: () =>
      isLoggedIn ? fetchLoggedInUsers(params) : fetchPublicUsers(params),
  });
};
