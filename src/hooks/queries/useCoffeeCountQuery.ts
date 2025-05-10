import { useQuery } from '@tanstack/react-query';
import { getUserCoffeeCount } from '@/services/userCoffee';

export const useCoffeeCountQuery = () => {
  return useQuery({
    queryKey: ['coffeeCount'],
    queryFn: getUserCoffeeCount,
  });
};
