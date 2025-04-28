import instance from '@/lib/axios';

interface ProfileImage {
    imageUrl: string;
    isMain: boolean;
  }

  interface UserProfileResponse {
    nickname: string;
    profile: {
      profileImage: ProfileImage[];
    };
  }

  // 내 프로필 정보 가져오기 함수
  export const getMyProfile = async (): Promise<{ nickname: string; profileImage: string }> => {
    try {
      const res = await instance.get<UserProfileResponse>('/user/me');
      const { nickname, profile } = res.data;
      const profileImage = profile.profileImage[0]?.imageUrl || '/default.png';
  
      return { nickname, profileImage };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('유저 프로필 가져오기 실패:', error.message);
      } else {
        console.error('알 수 없는 에러:', error);
      }
      throw error;
    }
  };
  