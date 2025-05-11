import instance from '@/lib/axios';
import {
  FilteredUser,
  FilteredUsersResponse,
  PaginationParams,
  FilterParams,
} from '@/types/member.type';

// 로그인 필터된 회원목록 조회
export const fetchLoggedInFilteredUsers = async (
  filter: FilterParams
): Promise<FilteredUser[]> => {
  const res = await instance.get<FilteredUsersResponse>(
    '/user-filter/filtered-list',
    {
      params: filter,
    }
  );
  return res.data.users;
};

// 비로그인 필터된 회원목록 조회
export const fetchPublicFilteredUsers = async (
  filter: FilterParams
): Promise<FilteredUser[]> => {
  const res = await instance.get<{ users: FilteredUser[] }>(
    '/user-filter/public-filtered-list',
    {
      params: filter,
    }
  );
  return res.data.users;
};

// 로그인 회원목록 조회
export const fetchLoggedInUsers = async (
  params?: PaginationParams
): Promise<FilteredUsersResponse> => {
  const res = await instance.get<FilteredUsersResponse>('/user-filter/list', {
    params,
  });
  return res.data;
};

// 비로그인 회원목록 조회
export const fetchPublicUsers = async (
  params?: PaginationParams
): Promise<FilteredUsersResponse> => {
  const res = await instance.get<FilteredUsersResponse>(
    '/user-filter/public-list',
    {
      params,
    }
  );
  return res.data;
};
