import { useQuery } from '@tanstack/react-query';
import { getUserRegionFestivals } from '@/services/festival';

export const useGetUserRegionFestivalsQuery = () => {
  return useQuery({
    queryKey: ['userRegionFestivals'],
    queryFn: getUserRegionFestivals,
    retry: false,
  });
};
