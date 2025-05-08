export interface Festival {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  imageUrl: string;
  region: string;
}

export interface FestivalResponse {
  festivals: Festival[];
}
