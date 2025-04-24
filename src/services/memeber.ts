import instance from '@/lib/axios';

export interface FilteredUser {
  id: string;
  nickname: string;
  region: string;
  likeCount: number;
  age: number;
  profile: {
    profileImage: {
      imageUrl: string;
    }[];
  };

}

export const fetchFilteredUsers = async (): Promise<FilteredUser[]> => {
  const res = await instance.get<FilteredUser[]>('/user-filter/filtered-users');
  return res.data;
};