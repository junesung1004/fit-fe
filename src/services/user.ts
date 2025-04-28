import instance from '@/lib/axios';

interface ProfileImage {
  imageUrl: string;
  isMain: boolean;
}

interface UserProfileResponse {
  id: string;
  nickname: string;
  job: string;
  height: number;
  birthday: string;
  likeCount: number;
  profile: {
    profileImage: ProfileImage[];
    mbti: {
      mbti: string;
    };
    interestCategory: string[];
    userIntroductions: string[];
    userFeedbacks: string[];
  };
}

// 내 프로필 정보 가져오기 함수
export const getMyProfile = async (): Promise<{
  id: string;
  nickname: string;
  profileImage: string;
  job: string;
  height: number;
  birthday: string;
  likeCount: number;
  mbti: string;
  interestCategory: string[];
  userIntroductions: string[];
  userFeedbacks: string[];
} | null> => {
  try {
    const res = await instance.get<UserProfileResponse>('/user/me');
    const { id, nickname, job, height, birthday, likeCount, profile } = res.data;
    const profileImage = profile.profileImage[0]?.imageUrl || '/default.png';
    const mbti = profile.mbti.mbti;
    const interestCategory = profile.interestCategory;
    const userIntroductions = profile.userIntroductions;
    const userFeedbacks = profile.userFeedbacks;

    return {
      id,
      nickname,
      profileImage,
      job,
      height,
      birthday,
      likeCount,
      mbti,
      interestCategory,
      userIntroductions,
      userFeedbacks,
    };
  } catch {
    return null;
  }
};
