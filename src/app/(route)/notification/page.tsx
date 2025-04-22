'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// 알림 타입 정의
type NotificationType = 'like' | 'match';

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  subMessage?: string;
  createdAt: string;
}

// 날짜 포맷
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleString('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

// 알림 컴포넌트
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
    const path = notification.type === 'like' ? '/members/1' : '/chats/1';
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
        <div className="text-sm font-medium text-gray-800">{notification.message}</div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // 카드 클릭과 삭제 버튼 충돌 방지
            onDelete(notification.id);
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
        {/* 이 부분 추가: 텍스트 표시만 하고 클릭은 카드 전체로 */}
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

// 메인 페이지 컴포넌트
export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'like',
      message: 'A님이 당신에게 좋아요를 눌렀어요!',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      type: 'match',
      message: 'B님과 매칭되었어요!',
      createdAt: new Date().toISOString(),
    },
  ]);

  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <main className="min-h-screen bg-white p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">알림</h2>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDelete={handleDeleteNotification}
        />
      ))}
    </main>
  );
}
