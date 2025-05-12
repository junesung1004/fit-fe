'use client';

import { useEffect } from 'react';
import { startStatusUpdates, stopStatusUpdates } from '@/store/userStatusStore';
import { socket } from '@/lib/socket';

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 연결 상태 이벤트 리스너 추가
    const handleConnect = () => {
      console.log('Socket connected');
    };

    const handleDisconnect = (reason: string) => {
      console.log('Socket disconnected:', reason);
    };

    const handleError = (error: Error) => {
      console.error('Socket error:', error);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('error', handleError);

    startStatusUpdates();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('error', handleError);
      stopStatusUpdates();
    };
  }, []);

  return <>{children}</>;
}
