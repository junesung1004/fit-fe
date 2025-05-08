import { useQuery } from '@tanstack/react-query';
import { getUserRegionFestivals } from '@/services/festival';
import { Festival } from '@/types/festival.type';

export const useGetUserRegionFestivalsQuery = (userId: string) => {
  return useQuery<Festival[]>({
    queryKey: ['userRegionFestivals', userId],
    queryFn: () => getUserRegionFestivals(userId),
    retry: false,
    enabled: !!userId,
  });
};
