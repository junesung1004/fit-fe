'use client';

import { useState, useEffect, useCallback } from 'react';
import socketService from '@/lib/socket';
import { getChatMessageData } from '@/services/chat'; // ✅ 추가

interface Message {
  content: string;
  userId: string;
  chatRoomId: string;
  createdAt: Date;
}

export const useChat = (chatRoomId: string, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // ✅ 1. 과거 메시지 가져오기
        const previousMessages = await getChatMessageData(chatRoomId);
        setMessages(previousMessages);
      } catch (error) {
        console.error('❌ 과거 메시지 로딩 실패', error);
      }
    };

    init();

    // ✅ 2. 소켓 연결
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
    sendMessage,
    isConnected,
  };
};
