// src/services/passMatch.ts

import instance from '@/lib/axios';

export const passMatchRequest = async (passedUserId: string) => {
  try {
    const response = await instance.post(`/pass/match/${passedUserId}`);
    return response.data; // 성공 시 서버 응답 반환
  } catch (error) {
    console.error('거절 요청 실패:', error);
    throw error; // 호출한 쪽에서 에러 처리 가능하게 던짐
  }
};



export const passBothUsers = async (userId1: string, userId2: string) => {
  return instance.post('/pass/both', {
    passedUserId1: userId1,
    passedUserId2: userId2,
  });
};
