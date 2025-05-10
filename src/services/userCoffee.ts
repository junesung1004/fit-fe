import instance from '@/lib/axios';

// 유저 커피 개수 조회
export const getUserCoffeeCount = async (): Promise<number | string> => {
  try {
    const res = await instance.get<number>('/user/user-coffee');
    return res.data;
  } catch {
    return '?';
  }
};
