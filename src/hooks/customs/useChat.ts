'use client';

import { useState, useEffect, useCallback } from 'react';
import socketService from '@/lib/socket';
import { getChatMessageData } from '@/services/chat';

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

export const useChat = (chatRoomId: string, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const { messages, partner } = await getChatMessageData(chatRoomId);
        setMessages(messages);
        setPartner(partner); // ✅ partner 정보도 상태로 저장
      } catch (error) {
        console.error('❌ 과거 메시지 로딩 실패', error);
      }
    };

    init();

    socketService.connect();
    const socket = socketService.socket;

    if (socket) {
      const handleConnect = () => setIsConnected(true);
      const handleDisconnect = () => setIsConnected(false);

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);

      socketService.joinRoom(chatRoomId, userId);

      const unsubscribe = socketService.onMessage((message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        unsubscribe();
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socketService.disconnect();
      };
    }
  }, [chatRoomId, userId]);

  const sendMessage = useCallback(
    (content: string) => {
      socketService.sendMessage(content, userId, chatRoomId);
    },
    [userId, chatRoomId]
  );

  return {
    messages,
    partner,
    sendMessage,
    isConnected,
  };
};
