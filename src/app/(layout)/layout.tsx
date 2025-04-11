import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import Image from 'next/image';
import React, { ReactNode } from 'react';

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen relative flex items-stretch justify-center">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={'/배경화면.png'}
          alt="배경화면"
          fill
          className="object-cover"
        />
      </div>

      {/* 박스: 가로는 지정 / 세로는 화면 꽉 채우기 */}
      <div className="relative flex flex-col min-h-screen xs2:w-full  xs:w-[500px] h-screen bg-white shadow-2xl lg:ml-[40%]">
        <Header />
        <main className="flex-grow overflow-auto pt-[80px] pb-[80px] scrollbar-hide">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
