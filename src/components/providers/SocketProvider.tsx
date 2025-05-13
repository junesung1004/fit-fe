'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  startStatusUpdates,
  stopStatusUpdates,
  reconnectUserStatusSocket,
} from '@/store/userStatusStore';
import { userStatusSocket } from '@/lib/socket';

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialized = useRef(false);
  const lastToken = useRef<string | null>(null);
  const isConnecting = useRef(false);

  // 토큰 설정 및 변경 감지 함수를 메모이제이션
  const setAuthToken = useCallback(() => {
    if (isConnecting.current) return;

    try {
      const authStorage = localStorage.getItem('auth-storage');
      const token = authStorage ? JSON.parse(authStorage)?.state?.token : null;

      // 토큰이 변경된 경우에만 재연결 시도
      if (token !== lastToken.current) {
        lastToken.current = token;
        isConnecting.current = true;
        reconnectUserStatusSocket(token || '');
      }
    } catch (e) {
      console.error('토큰 설정 실패:', e);
      lastToken.current = null;
      isConnecting.current = true;
      reconnectUserStatusSocket('');
    }
  }, []);

  // 스토리지 변경 감지 핸들러를 메모이제이션
  const handleStorageChange = useCallback(
    (e: StorageEvent) => {
      if (e.key === 'auth-storage') {
        setAuthToken();
      }
    },
    [setAuthToken]
  );

  // 연결 상태 이벤트 핸들러들을 메모이제이션
  const handleConnect = useCallback(() => {
    console.log('소켓 연결됨');
    isConnecting.current = false;
  }, []);

  const handleDisconnect = useCallback(
    (reason: string) => {
      console.log('소켓 연결 끊김:', reason);
      isConnecting.current = false;

      if (reason === 'io server disconnect') {
        setAuthToken();
      }
    },
    [setAuthToken]
  );

  const handleError = useCallback(
    (error: Error) => {
      console.error('소켓 에러:', error);
      isConnecting.current = false;

      if (error.message === 'No token provided') {
        setAuthToken();
      }
    },
    [setAuthToken]
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 초기 토큰 설정
    setAuthToken();

    // 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);
    userStatusSocket.on('connect', handleConnect);
    userStatusSocket.on('disconnect', handleDisconnect);
    userStatusSocket.on('error', handleError);

    // 상태 업데이트 시작
    startStatusUpdates();

    // 클린업 함수
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      userStatusSocket.off('connect', handleConnect);
      userStatusSocket.off('disconnect', handleDisconnect);
      userStatusSocket.off('error', handleError);
      stopStatusUpdates();
      initialized.current = false;
      isConnecting.current = false;
    };
  }, [
    handleStorageChange,
    handleConnect,
    handleDisconnect,
    handleError,
    setAuthToken,
  ]);

  return <>{children}</>;
}
