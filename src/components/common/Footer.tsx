'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrophyIcon,
  UserGroupIcon,
  UsersIcon,
  ChatBubbleOvalLeftIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';

const menus = [
  { href: '/home', icon: TrophyIcon, label: '월드컵' },
  { href: '/members', icon: UserGroupIcon, label: '회원 목록' },
  { href: '/friends', icon: UsersIcon, label: '친구 목록' },
  { href: '/chats', icon: ChatBubbleOvalLeftIcon, label: '채팅' },
  { href: '/mypage', icon: UserCircleIcon, label: '마이페이지' },
  
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="absolute bottom-0 w-full h-[80px] flex justify-center items-center border-t bg-gray-50">
      <nav>
        <ul className="flex gap-10">
          {menus.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            const colorClass = isActive ? 'text-gray-900' : 'text-gray-400';

            return (
              <li key={href}>
                <Link href={href} className="flex flex-col items-center hover:text-gray-900">
                  <Icon className={`w-8 h-8 ${colorClass}`} />
                  <span className={`text-sm ${colorClass}`}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
