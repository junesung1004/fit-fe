import instance from '@/lib/axios';

export interface MatchItem {
  matchId: string;
  matchedUserId: string;
  matchedNickname: string;
  matchedProfileImage: string;
  matchedAge: number;
  matchedRegion: string;
  matchedLikeCount: number;
}

export interface LikeUser {
  likeUserid: string;
  nickname: string;
  likeCount: number;
  age: number;
  region: string;
  profileImage: string;
}

export interface SparkListResponse {
  likeList: LikeUser[];
  // coffeeChatList: RawUser[];
  matchList: MatchItem[];
}

export const fetchSparkList = async (): Promise<SparkListResponse> => {
  const res = await instance.get<SparkListResponse>('/spark-list');
  return res.data;
};
