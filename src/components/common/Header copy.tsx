'use client';

import { usePathname, useRouter } from 'next/navigation';
import FitLogo from '@/assets/1.png';
import Link from 'next/link';
import { ArrowLeftIcon, BellIcon, HeartIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  isLoggedIn: boolean;
  likeCount?: number;
}

export default function Header({ isLoggedIn, likeCount = 0 }: HeaderProps) {
  const pathname = usePathname();

  const [isLoggedInState, setIsLoggedInState] = useState(isLoggedIn);

  const isBackHeader = pathname.includes('/signup');
  const isFriendsHeader = pathname.startsWith('/friends');
  const isSimpleHeader = !isLoggedInState;

  useEffect(() => {
    // 쿠키에서 로그인 토큰이 있는지 확인
    const cookies = document.cookie
      .split('; ')
      .reduce((acc: Record<string, string>, current) => {
        const [key, value] = current.split('=');
        acc[key] = value;
        return acc;
      }, {});

    if (cookies['token']) {
      setIsLoggedInState(true);
    } else {
      setIsLoggedInState(false);
    }
  }, []);

  if (isBackHeader) return <BackHeader />;
  if (isSimpleHeader) return <SimpleHeader />;
  if (isFriendsHeader) return <FriendsHeader likeCount={likeCount} />;
  return <HomeHeader likeCount={likeCount} />;
}

function HeaderLayout({
  left,
  center,
  right,
}: {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header className="relative flex items-center justify-center h-20 border-b px-4">
      <div className="absolute left-4 flex items-center">{left}</div>
      <div className="flex justify-center">{center}</div>
      <div className="absolute right-4 flex items-center">{right}</div>
    </header>
  );
}

function Logo() {
  return (
    <Link href="/home">
      <img
        src={FitLogo.src}
        alt="logo"
        className="h-[72px] w-auto cursor-pointer"
      />
    </Link>
  );
}

function BackHeader() {
  const router = useRouter();
  return (
    <HeaderLayout
      left={
        <button onClick={() => router.back()}>
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
      }
      center={<Logo />}
    />
  );
}

function SimpleHeader() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <HeaderLayout
      center={<Logo />}
      right={
        <button
          onClick={handleLogin}
          className="bg-rose-400 text-white px-3 py-1.5 text-sm rounded w-[80px]"
        >
          로그인
        </button>
      }
    />
  );
}

function HomeHeader({ likeCount }: { likeCount: number }) {
  return (
    <HeaderLayout
      left={
        <div className="text-lg font-bold flex items-center gap-4">
          <div className="cursor-pointer">오늘의 매칭</div>
          <Link href="/matching-results" className="text-blue-500">
            매칭결과
          </Link>
        </div>
      }
      center={<Logo />}
      right={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-rose-400 text-rose-400 px-3 py-1 rounded-full">
            <HeartIcon className="h-5 w-5" />
            <span>{likeCount}</span>
          </div>
          <BellIcon className="h-5 w-5 text-gray-600" />
        </div>
      }
    />
  );
}

function FriendsHeader({ likeCount }: { likeCount: number }) {
  const pathname = usePathname();
  const isReceived = pathname.includes('/received');
  const isSent = pathname.includes('/sent');

  return (
    <>
      <HomeHeader likeCount={likeCount} />
      <nav className="flex justify-center gap-6 py-2 border-b">
        <Link
          href="/friends/received"
          className={isReceived ? 'font-bold text-black' : 'text-gray-400'}
        >
          받은 호감
        </Link>
        <Link
          href="/friends/sent"
          className={isSent ? 'font-bold text-black' : 'text-gray-400'}
        >
          보낸 호감
        </Link>
      </nav>
    </>
  );
}
