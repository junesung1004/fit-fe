'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  deleteNotification,
  deleteAllNotifications,
  fetchNotifications,
  connectNotificationStream,
} from '@/services/notification';
import { useAuthStore } from '@/store/authStore';
import { Notification } from '@/types/notification.type';
import Spinner from '@/components/common/Spinner';

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleString('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

function NotificationItem({
  notification,
  onDelete,
}: {
  notification: Notification;
  onDelete: () => void;
}) {
  const router = useRouter();

  const handleCardClick = () => {
    if (notification.type === 'LIKE') {
      router.push('/friends');
      return;
    }
    if (notification.type === 'MATCH_REQUEST') {
      router.push('/friends');
      return;
    }
    if (notification.type === 'MATCH_ACCEPT') {
      router.push('/matching-results');
      return;
    }
    if (notification.type === 'CHAT') {
      router.push(
        `/chats/${notification.data.chatRoomId}?userId=${notification.data.senderId}`
      );
    }
    if (notification.type === 'COFFEE_CHAT_ACCEPT') {
      router.push(
        `/chats/${notification.data.chatRoomId}?userId=${notification.data.senderId}`
      );
      return;
    }
    if (notification.type === 'COFFEE_CHAT_REQUEST') {
      router.push('/friends');
      return;
    }
  };

  return (
    <div
      className="p-4 rounded-lg shadow-sm mb-3 bg-gray-50 hover:bg-violet-50 transition-colors duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center">
        <div className="text-sm font-semibold text-gray-800">
          {notification.title}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      <div className="mt-1 text-sm text-gray-700">{notification.content}</div>
      <div className="mt-2 text-xs font-medium text-gray-500">
        {notification.type === 'like' && '프로필 보러 가기'}
        {notification.type === 'CHAT' && '채팅하러 가기'}
      </div>
      <div className="text-[10px] text-gray-400 mt-2">
        {formatDate(notification.createdAt)}
      </div>
    </div>
  );
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    let eventSource: EventSource | null = null;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 3000;

    const connectSSE = () => {
      if (eventSource) {
        eventSource.close();
      }

      eventSource = connectNotificationStream(userId);

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (Array.isArray(parsed)) {
            setNotifications(parsed);
            // 알림이 없으면 SSE 연결 종료
            if (parsed.length === 0 && eventSource) {
              eventSource.close();
            }
          } else {
            // 새 알림 한 건
            setNotifications((prev) => {
              const newNotifications = [parsed, ...prev];
              // 알림이 없었다가 새로 생기면 SSE 연결 시작
              if (prev.length === 0) {
                connectSSE();
              }
              return newNotifications;
            });
          }
          setError(null);
        } catch {
          setError('알림 데이터를 처리하는 중 오류가 발생했습니다.');
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(connectSSE, RETRY_DELAY);
        } else {
          setError('알림 연결에 실패했습니다. 페이지를 새로고침해주세요.');
        }
      };
    };

    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNotifications();
        setNotifications(data);
        setError(null);

        // 알림이 있을 때만 SSE 연결
        if (data.length > 0) {
          connectSSE();
        }
      } catch {
        setError('알림을 불러오는데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [userId]);

  const handleDelete = async (notification: Notification) => {
    try {
      await deleteNotification(notification.id);
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      setError(null);
    } catch {
      setError('알림 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleClearAll = async () => {
    if (!userId) return;
    if (confirm('전체 알림을 삭제하시겠습니까?')) {
      try {
        await deleteAllNotifications();
        setNotifications([]);
        setError(null);
      } catch {
        setError('전체 알림 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white p-4 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
          <Spinner size="lg" color="primary" />
          <p className="text-gray-500 mt-4">알림을 불러오는 중...</p>
        </div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-white p-4 max-w-md mx-auto">
        <p className="text-center text-gray-500 mt-10">로그인이 필요합니다.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">알림</h2>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-red-500 hover:underline"
          >
            전체 삭제
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">알림이 없습니다.</p>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDelete={() => handleDelete(notification)}
          />
        ))
      )}
    </main>
  );
}
