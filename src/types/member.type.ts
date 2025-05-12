export interface FilteredUser {
  id: string;
  nickname: string;
  region: string;
  likeCount: number;
  age: number;
  profileImage: string;
}

export interface PaginationParams {
  cursor?: string | null;
  take: number;
}

export interface FilterParams {
  region: string;
  ageMin: number;
  ageMax: number;
  minLikes: number;
  maxLikes: number;
  page: number;
  limit: number;
}

export interface UsersQueryParams extends PaginationParams {
  filter?: FilterParams;
}

export interface FilteredUsersResponse {
  users: FilteredUser[];
  nextCursor: string | null;
}
