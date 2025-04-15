import NavItem from '@/components/page/mypage/NavItem';
import Payment from '@/components/page/mypage/Payment';
import Image from 'next/image';
import React from 'react';

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
  return (
    <div className="w-full min-h-full flex flex-col gap-10 items-center justify-center">
      <div className="flex flex-col gap-6 w-full px-14">
        {/* 커피 아이템 개수 */}
        <NavItem>
          <div className="flex justify-between items-center px-7">
            <p className="text-xl">나의 보유 커피</p>
            <p className="text-xl">☕ 32개</p>
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
