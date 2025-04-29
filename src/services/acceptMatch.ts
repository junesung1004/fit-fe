import instance from '@/lib/axios';

export const acceptMatchRequest = async (acceptedUserId: string) => {
    try {
      const response = await instance.post(`/match/accept/${acceptedUserId}`);
      return response.data; // 성공 시 서버 응답 반환
    } catch (error) {
      console.error('수락 요청 실패:', error);
      throw error; // 호출한 쪽에서 에러 처리 가능하게 던짐
    }
  };