import instance from '@/lib/axios';

export interface MemberDetailResponse {
  nickname: string;
  job: string;
  height: number;
  age: number;
  mbti: {
    id: string;
    mbti: string;
  };
  likeCount: number;
  profileImage: string;
  userFeedbacks: string[];
  userIntroductions: string[];
  interestCategory: string[];
}


export const fetchUserInfo = async (userId: string): Promise<MemberDetailResponse> => {
  const response = await instance.get(`/user/user-info/${userId}`);
  return response.data;
};
