import instance from '@/lib/axios';

interface UserProfileResponse {
  id: string;
  email: string;
  nickname: string;
  name: string;
  phone: string;
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
  name: string;
  phone: string;
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
    const {
      id,
      email,
      nickname,
      name,
      phone,
      profile,
      job,
      height,
      birthday,
      likeCount,
    } = res.data;
    const profileImage = profile.profileImage[0]?.imageUrl || '/default.png';
    const mbti = profile.mbti.mbti;
    const interestCategory = profile.interestCategory.map(
      (item) => item.interestCategory.name
    );
    const userIntroductions = profile.userIntroductions.map(
      (item) => item.introduction.name
    );
    const userFeedbacks = profile.userFeedbacks.map(
      (item) => item.feedback.name
    );

    return {
      id,
      email,
      nickname,
      name,
      phone,
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
export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<boolean> => {
  try {
    await instance.patch('/auth/change-password', {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return true; // 성공
  } catch (error) {
    console.error('비밀번호 변경 실패:', error);
    return false; // 실패
  }
};
