import instance from '@/lib/axios';

export interface FilteredUser {
  id: string;
  nickname: string;
  region: string;
  likeCount: number;
  age: number;
  profileImage: string;
}

// 실제 API가 반환하는 전체 형식
interface FilteredUsersResponse {
  users: FilteredUser[];
  nextCursor: string;
}

// 컴포넌트에서는 순수 배열을 기대하므로,
// 서비스에서 배열만 꺼내 반환하도록 수정합니다.
export const fetchFilteredUsers = async (): Promise<FilteredUser[]> => {
  const res = await instance.get<FilteredUsersResponse>(
    '/user-filter/filtered-users'
  );
  return res.data.users;  // ← users 배열만 반환
};


//비로그인
// services/member.ts
export const fetchAnonymousUsers = async (): Promise<FilteredUser[]> => {
  const res = await instance.get<{ users: FilteredUser[] }>(
    '/user-filter/users-for-anonymous-user'
  );
  return res.data.users;
};
