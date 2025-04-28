import instance from '@/lib/axios';

interface UserProfileResponse {
  id: string;
  email: string;
  nickname: string;
  profile: {
    profileImage: { imageUrl: string; isMain: boolean }[];
    mbti: { mbti: string };
    interestCategory: { interestCategory: { name: string } }[];
    userIntroductions: { introduction: { name: string } }[];
    userFeedbacks: { feedback: { name: string } }[];
  };
  job: string;
  height: number;
  birthday: string;
  likeCount: number;
}

export const getMyProfile = async (): Promise<{
  id: string;
  email: string;
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
    const { id, email, nickname, profile, job, height, birthday, likeCount } = res.data;
    const profileImage = profile.profileImage[0]?.imageUrl || '/default.png';
    const mbti = profile.mbti.mbti;
    const interestCategory = profile.interestCategory.map((item) => item.interestCategory.name);
    const userIntroductions = profile.userIntroductions.map((item) => item.introduction.name);
    const userFeedbacks = profile.userFeedbacks.map((item) => item.feedback.name);

    return {
      id,
      email,
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
