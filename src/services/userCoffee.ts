import instance from '@/lib/axios';

export const getUserCoffeeCount = async (): Promise<number | string> => {
  try {
    const res = await instance.get<number>('/user/user-coffee');
    return res.data; // 숫자 그대로 반환 (예: 100)
  } catch (error) {
    console.error('커피 개수 조회 실패:', error);
    return '?'; // 실패 시 ?로 처리
  }
};
