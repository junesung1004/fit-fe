import instance from '@/lib/axios';

export interface MatchResult {
  currentUser: {
    id: string;
    nickname: string;
    likeCount: number;
    age: number;
    region: string;
    profileImage: string;
  };
  selectedUser: {
    id: string;
    nickname: string;
    likeCount: number;
    age: number;
    region: string;
    profileImage: string;
  };
  matched: boolean;
}

export const fetchMatchResults = async (page: number = 1, limit: number = 10): Promise<MatchResult[]> => {
  const res = await instance.get<{ data: MatchResult[] }>('/match-result', {
    params: { page, limit },
  });
  return res.data.data;
};
