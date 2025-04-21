'use client';

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
  const bgColor =
    notification.type === 'match'
      ? 'bg-pink-100'
      : notification.type === 'like'
      ? 'bg-purple-100'
      : 'bg-gray-100';

  // 프로필 보기 링크 또는 채팅 링크 결정
  const profileLink = notification.type === 'like' ? '/members/1' : '/chats/1';

  return (
    <div className={`p-2 rounded-lg shadow-sm mb-2 ${bgColor}`}> {/* 둥근 모서리 변경 */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium text-gray-800">{notification.message}</div>
        
        {/* X 아이콘 클릭 시 알림 삭제 */}
        <button
          onClick={() => onDelete(notification.id)}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>

      {/* 버튼들을 메시지 아래에 배치 */}
      <div className="mt-2 flex justify-between">
        <a
          href={profileLink}
          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
        >
          <span>&rarr;</span>
          <span>{notification.type === 'like' ? '프로필 보러 가기' : '채팅하기'}</span>
        </a>
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

  // 알림 삭제 함수
  const handleDeleteNotification = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
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
