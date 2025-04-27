import instance from '@/lib/axios';

export interface MemberDetailResponse {
  id: string;
  job: string;
  height: string;
  birthday: string;
  interestCategory: string;
  profile: {
    profileImage: {
      id: string;
      imageUrl: string;
    }[];
    mbti: {
      id: string;
      mbti: string;
    };
    interestCategory: {
      id: string;
    }[];
    userIntroductions: {
      id: string;
    }[];
    userFeedbacks: {
      id: string;
    }[];
  };
  likeCount: number;
}

export const fetchUserInfo = async (userId: string): Promise<MemberDetailResponse> => {
  const response = await instance.get(`/user/user-info/${userId}`);
  return response.data;
};
