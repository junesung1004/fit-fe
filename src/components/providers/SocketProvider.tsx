'use client';

import { useEffect, useRef } from 'react';
import { startStatusUpdates, stopStatusUpdates } from '@/store/userStatusStore';
import { userStatusSocket } from '@/lib/socket';

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 토큰 설정
    const setAuthToken = () => {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          const token = parsed.state?.token;
          if (token) {
            userStatusSocket.auth = { token };
          }
        }
      } catch (e) {
        console.error('Failed to set auth token', e);
      }
    };

    // 토큰 설정 후 연결
    setAuthToken();

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

    userStatusSocket.on('connect', handleConnect);
    userStatusSocket.on('disconnect', handleDisconnect);
    userStatusSocket.on('error', handleError);

    startStatusUpdates();

    return () => {
      userStatusSocket.off('connect', handleConnect);
      userStatusSocket.off('disconnect', handleDisconnect);
      userStatusSocket.off('error', handleError);
      stopStatusUpdates();
      initialized.current = false;
    };
  }, []);

  return <>{children}</>;
}
