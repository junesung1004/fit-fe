'use client';

import { useParams, useRouter } from 'next/navigation';
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

const ChatPage = () => {
  const router = useRouter();
  const params = useParams();

  const [roomId, setRoomId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ 로딩 상태 추가

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(accessToken);
      setUserId(decoded.sub);
    } catch (error) {
      console.error('JWT 디코딩 실패:', error);
      router.push('/login');
      return;
    }

    if (params?.roomId && typeof params.roomId === 'string') {
      setRoomId(params.roomId);
    }

    setIsLoading(false); // ✅ 모든 준비 완료 후 로딩 끝
  }, [params, router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

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
