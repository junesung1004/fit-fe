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
  export const getMyProfile = async (): Promise<{ nickname: string; profileImage: string } | null> => {
    try {
      const res = await instance.get<UserProfileResponse>('/user/me');
      const { nickname, profile } = res.data;
      const profileImage = profile.profileImage[0]?.imageUrl || '/default.png';
      return { nickname, profileImage };
    } catch {
      return null; 
    }
  };