'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchNotifications,
  deleteNotification,
  deleteAllNotifications,
  Notification,
} from '@/services/notification';

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
      notification.type === 'like' ? `/members/${notification.senderId}` : `/chats/1`;
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
        <div className="text-sm font-medium text-gray-800">{notification.content}</div>
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
      <div
        className={`mt-1 text-xs font-medium ${
          notification.type === 'like' ? 'text-violet-500' : 'text-rose-500'
        }`}
      >
        {notification.type === 'like' && '프로필 보러 가기'}
        {notification.type === 'match' && '채팅하러 가기'}
      </div>
      <div className="text-[10px] text-gray-400 mt-1">{formatDate(notification.createdAt)}</div>
    </div>
  );
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'like',
      title: '좋아요 알림',
      content: '회원님을 마음에 들어하는 사람이 있어요 💕',
      senderId: 101,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      type: 'like',
      title: '좋아요 알림',
      content: '또 다른 회원님이 좋아요를 눌렀습니다 💖',
      senderId: 103,
      createdAt: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    const fetchNotificationsData = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications((prev) => [...prev, ...data]);
      } catch (error) {
        console.error('알림을 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchNotificationsData();
  }, []);

  const handleDeleteNotification = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  const handleClearAllNotifications = async () => {
    if (confirm('알림을 모두 삭제하시겠습니까?')) {
      try {
        await deleteAllNotifications();
        setNotifications([]);
      } catch (error) {
        console.error('전체 알림 삭제 실패:', error);
      }
    }
  };

  return (
    <main className="min-h-screen bg-white p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">알림</h2>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAllNotifications}
            className="text-sm text-red-500 hover:underline"
          >
            전체 삭제
          </button>
        )}
      </div>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDelete={handleDeleteNotification}
        />
      ))}
      {notifications.length === 0 && (
        <p className="text-gray-500 text-sm text-center mt-10">알림이 없습니다.</p>
      )}
    </main>
  );
}
