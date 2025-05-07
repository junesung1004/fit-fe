import { UserInterface } from '@/types/user.type';
import { useQuery } from '@tanstack/react-query';

interface UseGetUserQueryProps {
  userId: string | null;
}

export const useGetUserQuery = ({ userId }: UseGetUserQueryProps) => {
  return useQuery<UserInterface>({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('사용자 ID가 필요합니다.');

      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('사용자 정보를 가져오는데 실패했습니다.');
      }

      return response.json();
    },
    enabled: !!userId,
  });
};
