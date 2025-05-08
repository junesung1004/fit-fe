import instance from '@/lib/axios';
import { Festival } from '@/types/festival.type';

export const getUserRegionFestivals = async (
  userId: string
): Promise<Festival[]> => {
  try {
    const response = await instance.get<Festival[]>(
      `/festival/user-request/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('지역 축제 조회 실패:', error);
    throw error;
  }
};
