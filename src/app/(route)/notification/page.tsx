'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  deleteNotification,
  deleteAllNotifications,
  Notification,
} from '@/services/notification';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = 'https://api.fit-date.co.kr'; // ✅ 하드코딩된 API 주소

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
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: number) => void;
}) {
  const router = useRouter();

  const handleCardClick = () => {
    const path =
      notification.type === 'like'
        ? `/members/${notification.senderId}`
        : `/chats/${notification.senderId}`;
    router.push(path);
  };

  const bgColor =
    notification.type === 'match'
      ? 'bg-pink-100'
      : notification.type === 'like'
      ? 'bg-purple-100'
      : 'bg-gray-100';

  return (
    <div
      className={`p-2 rounded-lg shadow-sm mb-2 ${bgColor} cursor-pointer`}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center">
        <div className="text-sm font-semibold text-gray-800">
          {notification.title}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
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

    const eventSource = new EventSource(
      `${API_BASE_URL}/api/v1/sse/connect/${userId}`
    );

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
      eventSource.close();
    };

    return () => {
      fetch(`${API_BASE_URL}/api/v1/sse/disconnect/${userId}`);
      eventSource.close();
    };
  }, [userId]);

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('알림 삭제 실패:', err);
    }
  };

  const handleClearAll = async () => {
    if (confirm('전체 알림을 삭제하시겠습니까?')) {
      try {
        await deleteAllNotifications();
        setNotifications([]);
      } catch (err) {
        console.error('전체 알림 삭제 실패:', err);
      }
    }
  };

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
            onDelete={handleDelete}
          />
        ))
      )}
    </main>
  );
}
