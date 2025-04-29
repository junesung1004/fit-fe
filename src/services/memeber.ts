// services/member.ts
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

// 로그인 유저 - 필터 저장 (PATCH)
export const saveFilterSettings = async (filter: { region: string; minAge: number; maxAge: number; minLikeCount: number }): Promise<void> => {
  await instance.patch('/user-filter/user-filter', filter);
};

// 로그인 유저 - 필터된 유저 목록 조회 (GET)
export const fetchFilteredUsersFromGet = async (): Promise<FilteredUser[]> => {
  const res = await instance.get<FilteredUsersResponse>('/user-filter/filtered-users');
  return res.data.users;
};

// 비로그인
export const fetchAnonymousUsers = async (): Promise<FilteredUser[]> => {
  const res = await instance.get<{ users: FilteredUser[] }>('/user-filter/users-for-anonymous-user');
  return res.data.users;
};

// 유저 필터 조회 (현재 필터 상태 확인용)
export const fetchCurrentFilter = async (): Promise<{
  region: string;
  minAge: number;
  maxAge: number;
  minLikeCount: number;
}> => {
  const res = await instance.get('/user-filter/user-filter');
  return res.data;
};
