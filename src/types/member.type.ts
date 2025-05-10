export interface FilteredUser {
  id: string;
  nickname: string;
  region: string;
  likeCount: number;
  age: number;
  profileImage: string;
}

export interface FilteredUsersResponse {
  users: FilteredUser[];
  nextCursor: string;
}
