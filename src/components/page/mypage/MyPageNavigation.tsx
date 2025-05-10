'use client';

import React from 'react';
import NavItem from './NavItem';
import Image from 'next/image';
import { useCoffeeCountQuery } from '@/hooks/queries/useCoffeeCountQuery';
import { useMyProfileQuery } from '@/hooks/queries/useMyProfileQuery';

export default function MyPageNavigation() {
  const { data: coffeeCount } = useCoffeeCountQuery();
  const { data: user } = useMyProfileQuery();

  if (!user) {
    return null; // 비로그인 상태면 메뉴 숨김
  }

  return (
    <div className="w-full">
      <nav className="w-full">
        <ul className="flex flex-col gap-6 w-full px-14">
          {/* 커피 아이템 페이지 링크 */}
          <NavItem href="/mypage/payment">
            <div className="flex justify-between items-center px-7">
              <div className="flex items-center gap-2">
                <div className="relative w-[24px] h-[24px]">
                  <Image src={'/coffee-beans.png'} alt="커피이미지" fill />
                </div>
                <div className="text-xl">{coffeeCount}</div>{' '}
              </div>
              <div className="relative w-[16px] h-[16px]">
                <Image src={'/icons/Vector.png'} alt="화살표" fill />
              </div>
            </div>
          </NavItem>

          {/* 나의 인기 확인 페이지 링크 */}
          <NavItem href="/mypage/my-popular">
            <div className="flex justify-between items-center px-7">
              <div>
                <p className="text-xl">나의 인기 확인</p>
                <p className="text-xs text-gray-300">
                  나의 매력은 어떻게 되는지 확인해보세요!
                </p>
              </div>
              <div className="relative w-[16px] h-[16px]">
                <Image src={'/icons/Vector.png'} alt="화살표" fill />
              </div>
            </div>
          </NavItem>

          {/* 소개팅 설정 페이지 */}
          <NavItem href="/mypage/dating-settings">
            <div className="flex justify-between items-center px-7">
              <div className="text-xl">소개팅 설정</div>
              <div className="relative w-[16px] h-[16px]">
                <Image src={'/icons/Vector.png'} alt="화살표" fill />
              </div>
            </div>
          </NavItem>

          {/* 계정 정보 페이지 */}
          <NavItem href="/mypage/account-information">
            <div className="flex justify-between items-center px-7">
              <div className="text-xl">계정 정보</div>
              <div className="relative w-[16px] h-[16px]">
                <Image src={'/icons/Vector.png'} alt="화살표" fill />
              </div>
            </div>
          </NavItem>

          {/* 비밀번호 변경 페이지 */}
          <NavItem href="/mypage/password-change">
            <div className="flex justify-between items-center px-7">
              <div className="text-xl">비밀번호 변경</div>
              <div className="relative w-[16px] h-[16px]">
                <Image src={'/icons/Vector.png'} alt="화살표" fill />
              </div>
            </div>
          </NavItem>
        </ul>
      </nav>
    </div>
  );
}
