import instance from '@/lib/axios';

export interface FilteredUser {
  id: string;
  nickname: string;
  region: string;
  likeCount: number;
  age: number;
  profileImage: string;
}

interface FilteredUsersResponse {
  users: FilteredUser[];
  nextCursor: string;
}

// 로그인 유저 필터 (POST or PATCH)
export const fetchFilteredUsers = async (filter: { minAge: number; maxAge: number; minLikeCount: number }): Promise<FilteredUser[]> => {
  const res = await instance.patch<FilteredUsersResponse>(
    '/user-filter/user-filter',
    filter
  );
  return res.data.users;
};

// 비로그인
export const fetchAnonymousUsers = async (): Promise<FilteredUser[]> => {
  const res = await instance.get<{ users: FilteredUser[] }>(
    '/user-filter/users-for-anonymous-user'
  );
  return res.data.users;
};
