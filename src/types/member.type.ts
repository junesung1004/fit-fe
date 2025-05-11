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
  minAge: number;
  maxAge: number;
  minLikeCount: number;
}

export interface UsersQueryParams extends PaginationParams {
  filter?: FilterParams;
}

export interface FilteredUsersResponse {
  users: FilteredUser[];
  nextCursor: string | null;
}
