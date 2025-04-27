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

// 로그인 유저 첫 조회
export const fetchFilteredUsersInitial = async (): Promise<FilteredUser[]> => {
  const res = await instance.get<FilteredUsersResponse>(
    '/user-filter/filtered-users'
  );
  return res.data.users;
};

// 로그인 유저 필터 적용 (PATCH)
export const applyUserFilter = async (filter: { minAge: number; maxAge: number; minLikeCount: number }) => {
  await instance.patch('/user-filter/user-filter', filter);
};

// 로그인 유저 필터 적용 후 조회
export const fetchFilteredUsersAfterFilter = async (): Promise<FilteredUser[]> => {
  const res = await instance.get<FilteredUsersResponse>(
    '/user-filter/user-filter'
  );
  return res.data.users;
};

// 비로그인 유저
export const fetchAnonymousUsers = async (): Promise<FilteredUser[]> => {
  const res = await instance.get<{ users: FilteredUser[] }>(
    '/user-filter/users-for-anonymous-user'
  );
  return res.data.users;
};
