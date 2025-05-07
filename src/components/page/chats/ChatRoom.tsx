// components/ChatRoom.tsx
'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/common/Button';
import Image from 'next/image';
import Spinner from '@/components/common/Spinner';

interface Message {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  profileImage?: string;
  name?: string;
}

interface ChatRoomProps {
  chatRoomId: string;
}

export const ChatRoom = ({ chatRoomId }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    if (!userId) return;

    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      // 채팅방 참여
      socket.emit('join', {
        chatRoomId,
        userId,
      });
    });

    socket.on('connect_error', (err) => {
      console.error('❌ 소켓 연결 에러:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ 소켓 연결 해제됨:', reason);
    });

    socket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [chatRoomId, userId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !userId) return;

    socket.emit('message', {
      content: inputMessage,
      userId,
      chatRoomId,
      profileImage: '/default-profile.png',
      name: '사용자',
    });

    setInputMessage('');
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-violet-100">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.userId === userId ? 'justify-end' : 'justify-start'}`}
          >
            {message.userId !== userId && (
              <div className="flex items-end mr-2">
                <Image
                  src={message.profileImage || '/default-profile.png'}
                  alt="프로필"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col max-w-[70%]">
              {message.userId !== userId && (
                <span className="text-sm text-gray-600 mb-1">
                  {message.name || '알 수 없음'}
                </span>
              )}
              <div
                className={`rounded-lg p-3 ${
                  message.userId === userId
                    ? 'bg-violet-500 text-white'
                    : 'bg-white'
                }`}
              >
                {message.content}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 메시지 입력 */}
      <form onSubmit={sendMessage} className="p-4 rounded-t-lg bg-violet-300">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
          />
          <Button type="submit" size="md-70" color="violet" rounded="lg">
            전송
          </Button>
        </div>
      </form>
    </div>
  );
};
