'use client';

import NavItem from '@/components/page/mypage/NavItem';
import Payment from '@/components/page/mypage/Payment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getUserCoffeeCount } from '@/services/userCoffee';
import { getMyProfile } from '@/services/user'; // ✅ 사용자 정보 가져오기

interface PaymentDataType {
  id: number;
  quantity: number;
  price: string;
}

const PAYMENT_DATA: PaymentDataType[] = [
  { id: 1, quantity: 32, price: '$4,900' },
  { id: 2, quantity: 64, price: '$9,900' },
  { id: 3, quantity: 128, price: '$17,000' },
  { id: 4, quantity: 256, price: '$32,500' },
  { id: 5, quantity: 512, price: '$52,900' },
];

export default function PaymentPage() {
  const [coffeeCount, setCoffeeCount] = useState<number>(0);

  useEffect(() => {
    const fetchCoffee = async () => {
      const user = await getMyProfile();
      if (user) {
        const count = await getUserCoffeeCount(user.id);
        setCoffeeCount(count);
      }
    };
    fetchCoffee();
  }, []);

  return (
    <div className="w-full min-h-full flex flex-col gap-10 items-center justify-center">
      <div className="flex flex-col gap-6 w-full px-14">
        {/* 커피 아이템 개수 */}
        <NavItem>
          <div className="flex justify-between items-center px-7">
            <p className="text-xl">나의 보유 커피</p>
            <div className="flex items-center gap-2">
              <div className="relative w-[24px] h-[24px]">
                <Image src={'/coffee-beans.png'} alt="커피이미지" fill />
              </div>
              <div className="text-xl">{coffeeCount}</div>
            </div>
          </div>
        </NavItem>

        {/* 커피 개수별 결제 페이지 링크 */}
        <div className="flex flex-col gap-6 w-full p-14 border border-black rounded-3xl">
          <nav>
            <ul className="flex flex-col gap-5">
              {PAYMENT_DATA.map((el) => (
                <Payment key={el.id}>
                  <div className="flex justify-between">
                    <p className="text-xl">
                      ☕ <span className="text-rose-500">{el.quantity}</span>개
                    </p>
                    <div className="flex justify-center items-center gap-3">
                      <span className="text-slate-400">{el.price}</span>
                      <div className="relative w-[12px] h-[12px]">
                        <Image src={'/icons/Vector.png'} alt="화살표" fill />
                      </div>
                    </div>
                  </div>
                </Payment>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
