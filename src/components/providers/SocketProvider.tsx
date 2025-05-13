'use client';

import { useEffect } from 'react';
import { startStatusUpdates, stopStatusUpdates } from '@/store/userStatusStore';

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    startStatusUpdates();
    return () => {
      stopStatusUpdates();
    };
  }, []);

  return <>{children}</>;
}
