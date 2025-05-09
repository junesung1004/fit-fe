'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  deleteNotification,
  deleteAllNotifications,
  fetchNotifications,
  connectNotificationStream,
  markNotificationAsRead,
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
  onRead,
}: {
  notification: Notification;
  onDelete: () => void;
  onRead: () => void;
}) {
  const router = useRouter();

  const handleCardClick = () => {
    if (!notification.isRead) {
      onRead();
    }

    const path =
      notification.type === 'like'
        ? `/members/${notification.data?.senderId}`
        : `/chats/${notification.data?.senderId}`;
    router.push(path);
  };

  // 알림 타입에 따른 배경색 설정
  const getBgColor = () => {
    if (notification.isRead) return 'bg-gray-50';

    switch (notification.type) {
      case 'match':
        return 'bg-rose-50';
      case 'like':
        return 'bg-violet-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div
      className={`p-2 rounded-lg shadow-sm mb-2 ${getBgColor()} cursor-pointer`}
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
      <div
        className={`mt-1 text-xs font-medium ${
          notification.type === 'like' ? 'text-violet-500' : 'text-rose-500'
        }`}
      >
        {notification.type === 'like' && '프로필 보러 가기'}
        {notification.type === 'match' && '채팅하러 가기'}
      </div>
      <div className="text-[10px] text-gray-400 mt-1">
        {formatDate(notification.createdAt)}
      </div>
    </div>
  );
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
        } catch (err) {
          console.error('SSE JSON 파싱 실패:', err);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE 연결 오류:', err);
        eventSource?.close();

        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(
            `${RETRY_DELAY / 1000}초 후 재연결 시도 (${retryCount}/${MAX_RETRIES})`
          );
          setTimeout(connectSSE, RETRY_DELAY);
        } else {
          console.error('최대 재시도 횟수 초과');
        }
      };
    };

    // 초기 알림 목록 로드
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications(userId);
        setNotifications(data);
      } catch (err) {
        console.error('알림 목록 로드 실패:', err);
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
    } catch (err) {
      console.error('알림 삭제 실패:', err);
    }
  };

  const handleRead = async (notification: Notification) => {
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('알림 읽음 처리 실패:', err);
    }
  };

  const handleClearAll = async () => {
    if (!userId) return;

    if (confirm('전체 알림을 삭제하시겠습니까?')) {
      try {
        await deleteAllNotifications(userId);
        setNotifications([]);
      } catch (err) {
        console.error('전체 알림 삭제 실패:', err);
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

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">알림이 없습니다.</p>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDelete={() => handleDelete(notification)}
            onRead={() => handleRead(notification)}
          />
        ))
      )}
    </main>
  );
}
