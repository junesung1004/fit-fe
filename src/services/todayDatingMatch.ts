import instance from '@/lib/axios';
import { AxiosError } from 'axios';

interface TodatDatingMatch {
  message: string;
  errorCode?: string;
}

// 오늘의 매칭 4명 프로필 가져오는 api
export const todayDatingMatch = async () => {
  try {
    const response = await instance.get('/match/random');
    return response.data;
  } catch (error) {
    const err = error as AxiosError<TodatDatingMatch>;
    console.error('오늘의 데이팅 매칭 조회 실패 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
  }
};

// 2명중 1명 선택하는 api
export const datingOnePickUser = async () => {
  try {
    const response = await instance.post('/match/select');
    return response.data;
  } catch (error) {
    const err = error as AxiosError<TodatDatingMatch>;
    console.error('오늘의 매칭 중 한명 선택 실패 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
  }
};
