'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/solid';
import { BellIcon } from '@heroicons/react/24/solid';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Button from './Button';

export default function Header() {
  const pathName = usePathname();
  const router = useRouter();

  const { isLoggedIn, userName } = useAuthStore();
  console.log('이름', userName);

  return isLoggedIn ? (
    <header className="relative flex items-center justify-between h-20 border-b px-4">
      {/* left nav */}
      <div>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link
                href={'/home'}
                className={
                  pathName === '/home'
                    ? 'text-black font-bold'
                    : 'text-gray-400'
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
                    ? 'text-black font-bold'
                    : 'text-gray-400'
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
        <div className="flex gap-1 px-2 py-1 border border-rose-500 rounded-full">
          <HeartIcon height={24} width={24} className="fill-rose-500" />
          <span>30</span>
        </div>
        {/* 나의 알람 */}
        <Link href={'/notification'}>
          <BellIcon hanging={30} height={30} className="cursor-pointer" />
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
