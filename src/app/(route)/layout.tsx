import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import Image from 'next/image';
import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export default function CommonLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMembersPage = pathname?.includes('/members');

  return (
    <div className="w-full min-h-screen relative flex items-stretch justify-center">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={'/fit-date-bg.png'}
          alt="배경화면"
          fill
          className="object-cover"
        />
      </div>

      {/* 박스: 가로는 지정 / 세로는 화면 꽉 채우기 */}
      <div className="relative hidden md:flex flex-col justify-center items-center min-h-screen  lg:w-[800px] h-screen pr-36 ">
        <div className="relative w-[250px] h-[250px]">
          <Image src={'/fit-date-coffee-icon.png'} alt="커피 이미지" fill />
        </div>
        <div className="text-slate-700 text-3xl">
          <h1>Fit</h1>
          <h1 className="mb-10">
            당신의 인연, 오늘도 어디선가 커피를 기다리고 있어요.
          </h1>
          <p className="text-slate-700 text-sm">
            지금은 개발 중인 서비스입니다.
          </p>
          <p className="text-slate-700 text-sm">
            4명의 개발자들이 설레는 만남을 위해 힘쓰고 있어요!
          </p>
        </div>
      </div>

      {/* 박스: 가로는 지정 / 세로는 화면 꽉 채우기 */}
      <div className="relative flex flex-col h-screen xs2:w-full xs:w-[500px] bg-white shadow-2xl">
        <div className="h-[80px]">
          <Header />
        </div>
        <main className="flex-1 overflow-auto scrollbar-hide w-full">
          <div
            className={`min-h-full ${!isMembersPage ? 'flex items-center justify-center' : ''}`}
          >
            <div className={`w-full ${!isMembersPage ? 'max-w-3xl' : ''}`}>
              {children}
            </div>
          </div>
        </main>
        <div className="h-[80px]">
          <Footer />
        </div>
      </div>
    </div>
  );
}
