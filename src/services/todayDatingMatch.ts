import instance from '@/lib/axios';
import { AxiosError } from 'axios';

interface TodayDatingMatch {
  message: string;
  errorCode?: string;
}

export interface SelectMatchPayload {
  matchId: string;
  selectedUserId: string;
}
export interface SelectAllMatchPayload {
  matchId: string;
  firstSelectedUserId: string;
  secondSelectedUserId: string;
}

// 로그인 오늘의 매칭 4명 프로필 가져오는 api
export const todayDatingMatch = async () => {
  try {
    const response = await instance.get('/match/random');
    return response.data;
  } catch (error) {
    const err = error as AxiosError<TodayDatingMatch>;
    console.error('오늘의 데이팅 매칭 조회 실패 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
  }
};

// 비로그인 오늘의 매칭 4명 프로필 가져오는 api
export const publicTodayDatingMatch = async () => {
  try {
    const response = await instance.get('/match/random/public');
    return response.data;
  } catch (error) {
    const err = error as AxiosError<TodayDatingMatch>;
    console.error('오늘의 데이팅 매칭 조회 실패 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
  }
};

// 2명 중 1명 선택하는 api (이름 통일)
export const selectMatchUser = async (payload: SelectMatchPayload) => {
  try {
    const response = await instance.post('/match/select', payload);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<TodayDatingMatch>;
    console.error('오늘의 매칭 중 한명 선택 실패 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
  }
};

//모두 선택하기 api
export const selectAllMatchUser = async (payload: SelectAllMatchPayload) => {
  try {
    const response = await instance.post('/match/select-all', payload);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<TodayDatingMatch>;
    console.error('오늘의 매칭 모두 실패 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
  }
};
