'use client';

import { useEffect, useState } from 'react';
import ChatRoom from '@/components/page/chats/ChatRoom';
import { getChatMessageData } from '@/services/chat';
import { useParams } from 'next/navigation';

interface Message {
  content: string;
  userId: string;
  chatRoomId: string;
  createdAt: string;
}

interface Partner {
  id: string;
  profileImage: string;
}

export default function ChatPage() {
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const { roomId } = params as { roomId: string };

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const { chatRoomId, partner, messages } =
          await getChatMessageData(roomId);
        setChatRoomId(chatRoomId);
        setUserId(partner.id); // ✅ 서버가 나 말고 상대를 partner로 주는 경우엔 따로 처리해야 함
        setPartner(partner);
        setMessages(messages);
      } catch (err) {
        console.error('❌ 채팅방 데이터 가져오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        로딩 중...
      </div>
    );
  }

  if (!chatRoomId || !userId || !partner) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        채팅방 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="h-screen">
      <ChatRoom
        chatRoomId={chatRoomId}
        userId={userId}
        partner={partner}
        initialMessages={messages}
      />
    </div>
  );
}
