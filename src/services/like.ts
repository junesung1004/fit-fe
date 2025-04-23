import instance from '@/lib/axios';

// 사용자 좋아요 기록 API
export const likeMember = async (likedUserId: string) => {
  try {
    const response = await instance.post(`/like/${likedUserId}`);
    return response.data;
  } catch (error) {
    console.error('좋아요 기록 실패:', error);
    throw error;
  }
};

// 좋아요 상태 확인 API
export const getLikeStatus = async (likedUserId: number) => {
  try {
    const response = await instance.get(`/like/${likedUserId}/status`);
    return response.data; // true or false
  } catch (error) {
    console.error('좋아요 상태 확인 실패:', error);
    throw error;
  }
};
