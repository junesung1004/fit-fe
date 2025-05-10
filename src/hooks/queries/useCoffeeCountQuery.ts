import { useQuery } from '@tanstack/react-query';
import { getUserCoffeeCount } from '@/services/userCoffee';

interface UseCoffeeCountQueryOptions {
  enabled?: boolean;
}

export const useCoffeeCountQuery = (options?: UseCoffeeCountQueryOptions) => {
  return useQuery({
    queryKey: ['coffeeCount'],
    queryFn: getUserCoffeeCount,
    enabled: options?.enabled,
  });
};
