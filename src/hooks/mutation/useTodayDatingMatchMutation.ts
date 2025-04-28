import {
  publicTodayDatingMatch,
  todayDatingMatch,
} from '@/services/todayDatingMatch';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useTodayDatingMatchMutation = () => {
  return useMutation({
    mutationFn: async () => await todayDatingMatch(),
    onSuccess: () => {
      toast.success('오늘의 데이팅 회원이 도착했어요💓');
    },
    onError: (error) => {
      console.error('오늘의 데이팅 회원 조회가 실패했어요.', error);
      toast.error('오늘의 데이팅 회원 조회가 실패했어요.');
    },
  });
};

export const usePublicTodayDatingMatchMutation = () => {
  return useMutation({
    mutationFn: async () => await publicTodayDatingMatch(),
    onSuccess: () => {
      toast.success('오늘의 데이팅 회원이 도착했어요💓');
    },
    onError: (error) => {
      console.error('오늘의 데이팅 회원 조회가 실패했어요.', error);
      toast.error('오늘의 데이팅 회원 조회가 실패했어요.');
    },
  });
};
