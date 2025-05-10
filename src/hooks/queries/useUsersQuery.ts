import { useQuery } from '@tanstack/react-query';
import { fetchLoggedInUsers, fetchPublicUsers } from '@/services/memeber';
import { useAuthStore } from '@/store/authStore';

export const useUsersQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ['users', isLoggedIn],
    queryFn: () => (isLoggedIn ? fetchLoggedInUsers() : fetchPublicUsers()),
  });
};
