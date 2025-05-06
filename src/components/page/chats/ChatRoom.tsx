// components/ChatRoom.tsx
'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { useSearchParams } from 'next/navigation';

interface Message {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
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
    });

    setInputMessage('');
  };

  if (!isConnected) {
    return <div>연결 중...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.userId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.userId === userId
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* 메시지 입력 */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
};
