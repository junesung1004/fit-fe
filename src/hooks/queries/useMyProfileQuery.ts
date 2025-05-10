import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/services/user';

export const useMyProfileQuery = () => {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: getMyProfile,
  });
};
