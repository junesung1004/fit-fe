import { useQuery } from '@tanstack/react-query';
import { getUserRegionFestivals } from '@/services/festival';

export const useGetUserRegionFestivalsQuery = (userId: string) => {
  return useQuery({
    queryKey: ['userRegionFestivals', userId],
    queryFn: () => getUserRegionFestivals(userId),
    retry: false,
    enabled: !!userId,
  });
};
