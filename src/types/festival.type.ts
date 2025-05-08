export interface Festival {
  title: string;
  startDate: string;
  endDate: string;
  address: string;
  areaCode: string;
  thumbnail: string;
  naverSearchUrl: string;
}

export interface FestivalResponse {
  festivals: Festival[];
}
