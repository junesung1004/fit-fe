import instance from '@/lib/axios';

export const getUserCoffeeCount = async (userId: string): Promise<number> => {
  try {
    const res = await instance.get<number>(`/user/user-coffee/${userId}`);
    return res.data; // 숫자 그대로 반환 (예: 100)
  } catch (error) {
    console.error('커피 개수 조회 실패:', error);
    return 0; // 실패 시 0으로 처리
  }
};
