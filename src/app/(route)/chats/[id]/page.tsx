'use client';

// pages/chat/[roomId].tsx
import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ChatRoom from '@/components/page/chats/ChatRoom';

const ChatPage = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // 쿠키에서 사용자 정보 가져오기
    const userInfo = Cookies.get('userInfo');
    if (userInfo) {
      const { id } = JSON.parse(userInfo);
      setUserId(id);
    } else {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      router.push('/login');
    }
  }, [router]);

  if (!userId || !roomId) {
    return null;
  }

  return (
    <div className="h-screen">
      <ChatRoom chatRoomId={roomId as string} userId={userId} />
    </div>
  );
};

export default ChatPage;
