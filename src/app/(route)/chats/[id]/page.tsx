'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // 이거 설치 필요
import ChatRoom from '@/components/page/chats/ChatRoom';

interface TokenPayload {
  sub: string;
  role: string;
  type: string;
  iat: number;
  exp: number;
}

const ChatPage = () => {
  const router = useRouter();
  const params = useParams();
  const { roomId } = params as { roomId: string };
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');

    if (accessToken) {
      try {
        const decoded = jwtDecode<TokenPayload>(accessToken);
        setUserId(decoded.sub);
      } catch (error) {
        console.error('JWT 디코딩 실패:', error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!userId || !roomId) {
    return null;
  }

  return (
    <div className="h-screen">
      <ChatRoom chatRoomId={roomId} userId={userId} />
    </div>
  );
};

export default ChatPage;
