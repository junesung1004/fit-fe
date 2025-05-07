// components/ChatRoom.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { socket } from '@/lib/socket';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import { Message as MessageType, ChatRoomProps } from '@/types/chats.type';
import { Message as MessageComponent } from '@/components/page/chats/Message';
import { useGetChatMessagesQuery } from '@/hooks/queries/useGetChatMessagesQuery';

export const ChatRoom = ({ chatRoomId }: ChatRoomProps) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log('ChatRoom params:', { chatRoomId, userId });

  const { data: chatRoomData, isLoading } = useGetChatMessagesQuery(
    chatRoomId,
    userId
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 소켓 연결
  useEffect(() => {
    if (!userId) return;

    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
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

    socket.on('message', (message: MessageType) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [chatRoomId, userId]);

  // 채팅방 메시지 조회
  useEffect(() => {
    console.log('chatRoomData:', chatRoomData);
    if (chatRoomData?.messages) {
      setMessages(chatRoomData.messages);
    }
  }, [chatRoomData]);

  // 스크롤 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  if (!isConnected || isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-violet-100">
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-violet-100">
        {messages.map((message) => (
          <MessageComponent
            key={message.id}
            message={message}
            isMine={message.userId === userId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 */}
      <form onSubmit={sendMessage} className="p-4 rounded-t-lg bg-violet-300">
        <div className="flex gap-2 h-10">
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
