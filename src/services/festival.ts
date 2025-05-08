import instance from '@/lib/axios';
import { FestivalResponse } from '@/types/festival.type';

export const getUserRegionFestivals = async (
  userId: string
): Promise<FestivalResponse> => {
  try {
    const response = await instance.get<FestivalResponse>(
      `/api/v1/festival/user-request/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('지역 축제 조회 실패:', error);
    throw error;
  }
};
