'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import ChatRoom from '@/components/page/chats/ChatRoom';

interface TokenPayload {
  sub: string;
  role: string;
  type: string;
  iat: number;
  exp: number;
}

export default function ChatPage() {
  const params = useParams();
  const { roomId } = params as { roomId: string };
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) return;

    try {
      const decoded = jwtDecode<TokenPayload>(accessToken);
      setUserId(decoded.sub);
    } catch (error) {
      console.error('JWT 디코딩 실패:', error);
    }
  }, []);

  if (!roomId || !userId) {
    return (
      <div className="h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="h-screen">
      <ChatRoom chatRoomId={roomId} userId={userId} />
    </div>
  );
}
