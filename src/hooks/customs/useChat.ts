'use client';

// hooks/useChat.ts
import { useState, useEffect, useCallback } from 'react';
import socketService from '@/lib/socket';

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
        socket.off('connect', handleConnect); // ✅ clean-up 추가
        socket.off('disconnect', handleDisconnect); // ✅ clean-up 추가
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
