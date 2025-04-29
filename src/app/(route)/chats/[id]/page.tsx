'use client';

// pages/chat/[roomId]/page.tsx
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ChatRoom from '@/components/page/chats/ChatRoom';

const ChatPage = () => {
  const router = useRouter();
  const params = useParams();
  const { roomId } = params as { roomId: string }; // 여기 중요!

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userInfo = Cookies.get('userInfo');
    if (userInfo) {
      const { id } = JSON.parse(userInfo);
      setUserId(id);
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
