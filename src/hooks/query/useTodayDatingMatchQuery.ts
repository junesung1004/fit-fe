import { useQuery } from '@tanstack/react-query';
import {
  todayDatingMatch,
  publicTodayDatingMatch,
} from '@/services/todayDatingMatch';
import { toast } from 'react-toastify';

export const useTodayDatingMatchQuery = () => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['todayDatingMatch'],
    queryFn: todayDatingMatch,
  });

  // 에러 처리
  if (isError) {
    console.error('❌ 오늘의 데이팅 회원 조회 실패', error);
    toast.error('오늘의 데이팅 회원 조회 실패');
  }

  return { data, isLoading, isError, error };
};

export const usePublicTodayDatingMatchQuery = () => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['publicTodayDatingMatch'],
    queryFn: publicTodayDatingMatch,
  });

  // 에러 처리
  if (isError) {
    console.error('❌ 비로그인 오늘의 데이팅 회원 조회 실패', error);
    toast.error('오늘의 데이팅 회원 조회 실패');
  }

  return { data, isLoading, isError, error };
};
