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
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chatRoomData, isLoading } = useGetChatMessagesQuery(
    chatRoomId,
    userId
  );
  const [messages, setMessages] = useState<MessageType[]>([]);

  // 채팅방 메시지 초기 데이터 설정 및 스크롤
  useEffect(() => {
    if (chatRoomData?.messages) {
      setMessages(chatRoomData.messages);
      // 초기 메시지 로드 후 스크롤 최하단
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [chatRoomData]);

  // 새 메시지 추가 시 스크롤 최하단으로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 소켓 연결 및 메시지 수신 설정
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

    socket.on('message', (message: MessageType) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [chatRoomId, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !userId) return;

    socket.emit('message', {
      content: inputMessage,
      userId,
      chatRoomId,
      profileImage: chatRoomData?.partner?.profileImage || '/default.png',
      name: chatRoomData?.partner?.name || '알 수 없음',
    });

    setInputMessage('');
  };

  if (isLoading || !isConnected) {
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
            message={{
              ...message,
              profileImage: !message.isMine
                ? chatRoomData?.partner?.profileImage
                : undefined,
              name: !message.isMine ? chatRoomData?.partner?.name : undefined,
            }}
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
