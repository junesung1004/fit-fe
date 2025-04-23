'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BellIcon } from '@heroicons/react/24/solid';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Button from './Button';
import { useNotificationStore } from '@/store/notificationStore'; // Zustand store import

export default function Header() {
  const pathName = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  // Zustand에서 알림 상태 가져오기
  const { notifications, hasNew } = useNotificationStore();

  return isLoggedIn ? (
    <header className="relative flex items-center justify-between border-b px-4 py-4">
      {/* left nav */}
      <div>
        <nav>
          <ul className="flex gap-2">
            <li>
              <Link
                href={'/home'}
                className={
                  pathName === '/home'
                    ? 'text-black font-bold text-sm'
                    : 'text-gray-400 text-sm'
                }
              >
                오늘의 매칭
              </Link>
            </li>
            <li>
              <Link
                href={'/matching-results'}
                className={
                  pathName === '/matching-results'
                    ? 'text-black font-bold text-sm'
                    : 'text-gray-400 text-sm'
                }
              >
                매칭 결과
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* middle container */}
      <div className="relative w-12 h-12">
        <Link href={'/home'}>
          <Image
            src={'/icons/fit_logo.png'}
            alt="로고 이미지"
            fill
            className="object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* right container */}
      <div className="flex justify-center items-center gap-1">
        {/* 나의 하트 */}
        <div className="flex justify-center items-center gap-1 px-2 pb-0.5 border border-black rounded-full">
          <div className="relative w-[30px] h-[30px]">
            <Image src={'/coffee-beans.png'} alt="커피이미지" fill />
          </div>
          <span className="pt-1">30</span>
        </div>
        {/* 나의 알람 */}
        <Link href={'/notification'} className="relative">
          <BellIcon height={30} className="cursor-pointer" />
          {/* 알림 숫자 표시 */}
          {hasNew && (
            <span className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  ) : (
    <header className="relative flex items-center justify-between h-20 border-b px-4">
      {/* left nav */}
      <div></div>

      {/* middle container */}
      <div className="relative w-12 h-12">
        <Link href={'/home'}>
          <Image
            src={'/icons/fit_logo.png'}
            alt="로고 이미지"
            fill
            className="object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* right container */}
      <div className="flex">
        <Button rounded="md" onClick={() => router.push('/login')}>
          로그인
        </Button>
      </div>
    </header>
  );
}
