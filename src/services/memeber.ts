import instance from '@/lib/axios';
import { FilteredUser, FilteredUsersResponse } from '@/types/member.type';

// 로그인 필터된 회원목록 조회
export const fetchLoggedInFilteredUsers = async (filter: {
  region: string;
  minAge: number;
  maxAge: number;
  minLikeCount: number;
}): Promise<FilteredUser[]> => {
  const res = await instance.get<FilteredUsersResponse>(
    '/user-filter/filtered-list',
    {
      params: filter,
    }
  );
  return res.data.users;
};

// 비로그인 필터된 회원목록 조회
export const fetchPublicFilteredUsers = async (filter: {
  region: string;
  minAge: number;
  maxAge: number;
  minLikeCount: number;
}): Promise<FilteredUser[]> => {
  const res = await instance.get<{ users: FilteredUser[] }>(
    '/user-filter/public-filtered-list',
    {
      params: filter,
    }
  );
  return res.data.users;
};

// 로그인 회원목록 조회
export const fetchLoggedInUsers = async (): Promise<FilteredUser[]> => {
  const res = await instance.get<FilteredUsersResponse>('/user-filter/list');
  return res.data.users;
};

// 비로그인 회원목록 조회
export const fetchPublicUsers = async (): Promise<FilteredUser[]> => {
  const res = await instance.get<{ users: FilteredUser[] }>(
    '/user-filter/public-list'
  );
  return res.data.users;
};
