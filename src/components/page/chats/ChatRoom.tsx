// components/ChatRoom.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { socket } from '@/lib/socket';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import { Message, ChatRoomProps } from '@/types/chats.type';
import { Message as MessageComponent } from '@/components/page/chats/Message';
import { useGetChatMessagesQuery } from '@/hooks/queries/useGetChatMessagesQuery';
import { useGetUserRegionFestivalsQuery } from '@/hooks/queries/useGetUserRegionFestivalsQuery';

export const ChatRoom = ({ chatRoomId }: ChatRoomProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chatRoomData, isLoading: isChatLoading } =
    useGetChatMessagesQuery(chatRoomId, userId);
  const { data: festivalData } = useGetUserRegionFestivalsQuery(userId || '');
  const [messages, setMessages] = useState<Message[]>([]);

  // 채팅방 메시지 초기 데이터 설정 및 스크롤
  useEffect(() => {
    console.log('메시지 초기화 useEffect 실행', {
      chatRoomDataMessages: chatRoomData?.messages?.length,
      festivalData: festivalData?.festivals?.length,
    });

    if (chatRoomData?.messages) {
      // 축제 정보를 메시지 형태로 변환
      const festivalMessage: Message = {
        id: 'festival-info',
        content: '이 지역의 축제 정보',
        userId: 'system',
        chatRoomId,
        createdAt: new Date().toISOString(),
        isMine: false,
        isFestivalInfo: true,
        festivals: festivalData?.festivals || [],
      };

      setMessages([...chatRoomData.messages, festivalMessage]);
      // 초기 메시지 로드 후 스크롤 최하단
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [chatRoomData, festivalData]);

  // 새 메시지 추가 시 스크롤 최하단으로 이동
  useEffect(() => {
    console.log('스크롤 useEffect 실행', {
      messagesLength: messages.length,
      lastMessage: messages[messages.length - 1]?.content,
    });
    scrollToBottom();
  }, [messages]);

  // 소켓 연결 및 메시지 수신 설정
  useEffect(() => {
    console.log('소켓 연결 useEffect 실행', { userId, chatRoomId });
    if (!userId) return;

    socket.connect();

    socket.on('connect', () => {
      console.log('소켓 연결됨');
      setIsConnected(true);
      socket.emit('join', {
        chatRoomId,
        userId,
      });
    });

    socket.on('message', (message: Message) => {
      console.log('새 메시지 수신', message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      console.log('소켓 연결 해제');
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

  if (isChatLoading || !isConnected) {
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
        {messages.map((message) =>
          message.isFestivalInfo && message.festivals ? (
            <div key={message.id} className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">이 지역의 축제</h3>
              <div className="flex flex-col gap-2">
                {message.festivals.map((festival) => (
                  <div
                    key={festival.title}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-violet-700">
                        {festival.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(festival.startDate).toLocaleDateString()} ~{' '}
                        {new Date(festival.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {festival.address}
                    </p>
                    <a
                      href={festival.naverSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-violet-600 hover:text-violet-800 mt-2 inline-block"
                    >
                      네이버에서 더 알아보기
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
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
          )
        )}
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
