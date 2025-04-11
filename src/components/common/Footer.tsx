import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="absolute bottom-0 w-full h-[80px] flex justify-center items-center  border-t-2 bg-white">
      <nav>
        <ul className="flex gap-10">
          <li>
            <Link href={'/home'}>월드컵</Link>
          </li>
          <li>
            <Link href={'/members'}>회원 목록</Link>
          </li>
          <li>
            <Link href={'/friends'}>친구 목록</Link>
          </li>
          <li>
            <Link href={'/chats'}>채팅</Link>
          </li>
          <li>
            <Link href={'/mypage'}>마이페이지</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
