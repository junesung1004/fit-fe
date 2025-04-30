// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { socketService } from '@/lib/socket';
// import { getChatMessageData } from '@/services/chat';
// import type { SocketMessage } from '@/lib/socket';

// export interface Message extends SocketMessage {
//   id: string;
//   createdAt: string;
// }

// interface Partner {
//   id: string;
//   profileImage: string;
// }

// interface ChatError {
//   message: string;
//   code?: string;
//   error?: Error;
// }

// export const useChat = (chatRoomId: string, userId: string) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [partner, setPartner] = useState<Partner | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<ChatError | null>(null);

//   useEffect(() => {
//     const init = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const { messages, partner } = await getChatMessageData(chatRoomId);
//         setMessages(messages);
//         setPartner(partner);
//       } catch (error) {
//         console.error('❌ 과거 메시지 로딩 실패', error);
//         setError({
//           message: '메시지를 불러오는데 실패했습니다.',
//           code: 'LOAD_MESSAGES_FAILED',
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     init();

//     socketService.connect();
//     const socket = socketService.socket;

//     if (socket) {
//       const handleConnect = () => {
//         setIsConnected(true);
//         // 재연결 시 채팅방 재입장
//         socketService.joinRoom(chatRoomId, userId);
//       };

//       const handleDisconnect = () => {
//         setIsConnected(false);
//         setError({
//           message: '연결이 끊어졌습니다. 재연결을 시도합니다.',
//           code: 'DISCONNECTED',
//         });
//       };

//       const handleError = (error: Error) => {
//         setError({
//           message: '연결 중 오류가 발생했습니다.',
//           code: 'CONNECTION_ERROR',
//           error,
//         });
//       };

//       socket.on('connect', handleConnect);
//       socket.on('disconnect', handleDisconnect);
//       socket.on('error', handleError);

//       socketService.joinRoom(chatRoomId, userId);

//       const unsubscribe = socketService.onMessage((message: SocketMessage) => {
//         setMessages((prev) => [
//           ...prev,
//           {
//             ...message,
//             id: Date.now().toString(),
//             createdAt: new Date().toISOString(),
//           },
//         ]);
//       });

//       return () => {
//         unsubscribe();
//         socket.off('connect', handleConnect);
//         socket.off('disconnect', handleDisconnect);
//         socket.off('error', handleError);
//         socketService.disconnect();
//       };
//     }
//   }, [chatRoomId, userId]);

//   const sendMessage = useCallback(
//     async (content: string) => {
//       try {
//         await socketService.sendMessage(content, userId, chatRoomId);
//       } catch (error) {
//         console.error('메시지 전송 실패:', error);
//         setError({
//           message: '메시지 전송에 실패했습니다.',
//           code: 'SEND_MESSAGE_FAILED',
//         });
//       }
//     },
//     [userId, chatRoomId]
//   );

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   return {
//     messages,
//     partner,
//     sendMessage,
//     isConnected,
//     isLoading,
//     error,
//     clearError,
//   };
// };
