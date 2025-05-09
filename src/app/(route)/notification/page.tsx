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
    const path =
      notification.type === 'like'
        ? `/members/${notification.data?.senderId}`
        : `/chats/${notification.data?.senderId}`;
    router.push(path);
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
        {notification.type === 'match' && '채팅하러 가기'}
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
          const data = JSON.parse(event.data);
          setNotifications((prev) => [data, ...prev]);
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

    // 초기 알림 목록 로드
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
        setError(null);
      } catch {
        setError('알림을 불러오는데 실패했습니다. 다시 시도해주세요.');
      }
    };

    loadNotifications();
    connectSSE();

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
