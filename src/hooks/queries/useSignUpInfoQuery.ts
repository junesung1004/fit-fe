import {
  signupFeedbackData,
  signupInterestCategoryData,
  signupIntroduceData,
} from '@/services/signUp';
import { useQuery } from '@tanstack/react-query';

// 관심사 카테고리리
export const useInterestsQuery = () => {
  return useQuery({
    queryKey: ['interest'],
    queryFn: async () => {
      const res = await signupInterestCategoryData();
      //console.log('관심사 api get 데이터 정보 : ', res);
      return res;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

// 피드백
export const useFeedbackQuery = () => {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      const res = await signupFeedbackData();
      //console.log('피드백 api get 데이터 정보 : ', res);
      return res;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

// 저는 이런사람이에요

export const useIntroduceQuery = () => {
  return useQuery({
    queryKey: ['introduce'],
    queryFn: async () => {
      const res = await signupIntroduceData();
      //console.log('피드백 api get 데이터 정보 : ', res);
      return res;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
