'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  TrophyIcon,
  UserGroupIcon,
  UsersIcon,
  ChatBubbleOvalLeftIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/authStore';
import LoginRequiredModal from './LoginRequiredModal';

const menus = [
  { href: '/home', icon: TrophyIcon, label: '월드컵', auth: false },
  { href: '/members', icon: UserGroupIcon, label: '회원 목록', auth: false },
  { href: '/friends', icon: UsersIcon, label: '호감', auth: true },
  { href: '/chats', icon: ChatBubbleOvalLeftIcon, label: '채팅', auth: true },
  { href: '/mypage', icon: UserCircleIcon, label: '마이페이지', auth: true },
];

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleClick = (href: string, requiresAuth: boolean) => {
    if (requiresAuth && !isLoggedIn) {
      setShowLoginModal(true);
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <footer className="absolute bottom-0 w-full h-[80px] flex items-center border-t bg-gray-50">
        <nav className="w-full flex">
          <ul className="flex w-full justify-around">
            {menus.map(({ href, icon: Icon, label, auth }) => {
              const isActive = pathname === href;
              const colorClass = isActive ? 'text-gray-900' : 'text-gray-400';

              return (
                <li key={href}>
                  <button
                    onClick={() => handleClick(href, auth)}
                    className="flex flex-col items-center hover:text-gray-900"
                  >
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                    <span className={`text-sm ${colorClass}`}>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </footer>

      {showLoginModal && (
        <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
