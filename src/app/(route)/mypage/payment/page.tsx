'use client';

import NavItem from '@/components/page/mypage/NavItem';
import PaymentModal from '@/components/page/mypage/PaymentModal';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getUserCoffeeCount } from '@/services/userCoffee';
import { getMyProfile } from '@/services/user';
import { PaymentDataType } from '@/types/payment.type';

const PAYMENT_DATA: PaymentDataType[] = [
  { id: 1, quantity: 30, price: '$2,900' },
  { id: 2, quantity: 60, price: '$5,900' },
  { id: 3, quantity: 120, price: '$10,000' },
  { id: 4, quantity: 240, price: '$20,000' },
  { id: 5, quantity: 500, price: '$40,000' },
];

export default function PaymentPage() {
  const [coffeeCount, setCoffeeCount] = useState<number>(0);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentDataType | null>(null);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    phone: string;
  } | null>(null);

  useEffect(() => {
    const fetchCoffee = async () => {
      const user = await getMyProfile();
      if (user) {
        const count = await getUserCoffeeCount(user.id);
        setCoffeeCount(count);
        setUserInfo({
          name: user.name,
          email: user.email,
          phone: user.phone,
        });
      }
    };
    fetchCoffee();
  }, []);

  const handlePaymentClick = (payment: PaymentDataType) => {
    setSelectedPayment(payment);
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
  };

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
                <li
                  key={el.id}
                  className="w-full p-5 border border-black rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handlePaymentClick(el)}
                >
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
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {selectedPayment && userInfo && (
        <PaymentModal
          isOpen={!!selectedPayment}
          onClose={handleCloseModal}
          quantity={selectedPayment.quantity}
          price={selectedPayment.price}
          userName={userInfo.name}
          userEmail={userInfo.email}
          userPhone={userInfo.phone}
        />
      )}
    </div>
  );
}
