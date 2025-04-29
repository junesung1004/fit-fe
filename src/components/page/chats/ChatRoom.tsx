'use client';

import { useChat } from '@/hooks/customs/useChat';
import { useState, useRef, useEffect } from 'react';

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

interface ChatRoomProps {
  chatRoomId: string;
  userId: string;
  partner: Partner;
  initialMessages: Message[];
}

const ChatRoom = ({ chatRoomId, userId }: ChatRoomProps) => {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, partner, sendMessage, isConnected } = useChat(
    chatRoomId,
    userId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  // ✅ 새 메시지가 생기면 자동으로 스크롤 아래로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ✅ 상단 헤더 */}
      <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
        {partner && (
          <>
            <img
              src={partner.profileImage}
              alt="상대 프로필"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">
              상대방 ID: {partner.id.slice(0, 6)}...
            </span>
          </>
        )}
        <div className="ml-auto text-xs text-gray-500 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
          />
          {isConnected ? '연결됨' : '연결 끊김'}
        </div>
      </div>

      {/* ✅ 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            메시지가 없습니다.
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.userId === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${
                  message.userId === userId
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        {/* ✅ 자동 스크롤 대상 */}
        <div ref={scrollRef} />
      </div>

      {/* ✅ 입력창 */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
