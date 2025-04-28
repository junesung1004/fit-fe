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
  const [isConnected] = useState(false);

  useEffect(() => {
    socketService.connect();
    socketService.joinRoom(chatRoomId, userId);

    const unsubscribe = socketService.onMessage((message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      unsubscribe();
      socketService.disconnect();
    };
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
