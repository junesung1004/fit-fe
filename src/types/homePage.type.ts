export interface UserDataType {

  matchId?:string;
  id: number;
  nickname: string;
  birthday: number;
  region: string;
  height: number;
  mbti: string;
  image: string;
  profile: {
    mbti: {
      mbti: string;
    };
    profileImage: {
      imageUrl: string;
    }[];
  };
}
