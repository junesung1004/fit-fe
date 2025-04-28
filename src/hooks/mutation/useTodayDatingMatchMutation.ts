import {
  publicTodayDatingMatch,
  todayDatingMatch,
  todayDatingSuccessSelector,
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

export const useTodayDatingSuccess = () => {
  return useMutation({
    mutationFn: async (partnerId: string) =>
      await todayDatingSuccessSelector(partnerId),
    onSuccess: () => {
      toast.success('최종 선택을 수락하셨습니다. 채팅방이 생성되었습니다.');
    },
    onError: (error) => {
      console.error('오늘의 데이팅 최종 수락 선택 실패', error);
      toast.error('오늘의 데이팅 최종 수락 선택 실패.');
    },
  });
};
