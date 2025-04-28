// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const socketService = {
  socket: null as Socket | null,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  messageHandlers: [] as ((message: any) => void)[],

  connect: () => {
    if (!socketService.socket) {
      socketService.socket = io('http://localhost:3000', {
        transports: ['websocket'],
        autoConnect: true,
      });

      socketService.socket.on('connect', () => {
        console.log('채팅 서버 연결됨');
      });

      socketService.socket.on('message', (message) => {
        socketService.messageHandlers.forEach((handler) => handler(message));
      });
    }
  },

  joinRoom: (chatRoomId: string, userId: string) => {
    if (socketService.socket) {
      socketService.socket.emit('join', { chatRoomId, userId });
    }
  },

  sendMessage: (content: string, userId: string, chatRoomId: string) => {
    if (socketService.socket) {
      socketService.socket.emit('message', { content, userId, chatRoomId });
    }
  },

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onMessage: (handler: (message: any) => void) => {
    socketService.messageHandlers.push(handler);
    return () => {
      socketService.messageHandlers = socketService.messageHandlers.filter(
        (h) => h !== handler
      );
    };
  },

  disconnect: () => {
    if (socketService.socket) {
      socketService.socket.disconnect();
      socketService.socket = null;
    }
  },
};

export default socketService;
