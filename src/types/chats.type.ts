import { Festival } from './festival.type';

export interface PartnerType {
  id: string;
  name: string;
  age: number;
  height: number;
  profileImage: string;
}

export interface ChatRoomType {
  id: string;
  name: string;
  partner: PartnerType;
  userId: string;
}

export interface ChatRoomResponse {
  id: string;
  name: string;
  partner: PartnerType;
  userId: string;
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  chatRoomId: string;
  createdAt: string;
  profileImage?: string;
  name?: string;
  isMine: boolean;
  isFestivalInfo?: boolean;
  festivals?: Festival[];
}

export interface ChatRoomProps {
  chatRoomId: string;
}

export interface MessageProps {
  message: Message;
  isMine: boolean;
}
