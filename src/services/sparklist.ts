import instance from '@/lib/axios';

export interface MatchItem {
  matchedUserId: string;
  nickname: string;
  likeCount: number;
  age: number;
  region: string;
  profileImage: string;
}

export interface LikeUser {
  likeUserid: string;
  nickname: string;
  likeCount: number;
  age: number;
  region: string;
  profileImage: string;
}

export interface CoffeeChatUser {
  CoffeeChatUserid: string;
  nickname: string;
  likeCount: number;
  age: number;
  region: string;
  profileImage: string;
}

export interface SparkListResponse {
  likeList: LikeUser[];
  coffeeChatList: CoffeeChatUser[];
  matchList: MatchItem[];
}

export const fetchSparkList = async (): Promise<SparkListResponse> => {
  const res = await instance.get<SparkListResponse>('/spark-list');
  return res.data;
};
