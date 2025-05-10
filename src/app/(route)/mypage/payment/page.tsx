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
  const [coffeeCount, setCoffeeCount] = useState<number | string>(0);
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
        const count = await getUserCoffeeCount();
        if (typeof count === 'number') {
          setCoffeeCount(count);
        } else {
          setCoffeeCount('?');
        }
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
    <div className="w-full min-h-full flex flex-col gap-8 items-center justify-center py-12">
      <div className="flex flex-col gap-8 w-full max-w-2xl px-6">
        {/* 커피 아이템 개수 */}
        <NavItem>
          <div className="flex justify-between items-center px-6 py-4">
            <p className="text-xl font-semibold text-gray-800">
              나의 보유 커피
            </p>
            <div className="flex items-center gap-3 bg-rose-50 px-4 py-2 rounded-full">
              <div className="relative w-6 h-6">
                <Image src={'/coffee-beans.png'} alt="커피이미지" fill />
              </div>
              <div className="text-xl font-bold text-rose-600">
                {coffeeCount}
              </div>
            </div>
          </div>
        </NavItem>

        {/* 커피 개수별 결제 페이지 링크 */}
        <div className="flex flex-col gap-6 w-full p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            커피 충전하기
          </h2>
          <p className="text-gray-600 mb-4">원하는 수량을 선택해주세요</p>
          <nav>
            <ul className="flex flex-col gap-4">
              {PAYMENT_DATA.map((el) => (
                <li
                  key={el.id}
                  className="w-full p-6 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-rose-200 hover:shadow-md transition-all duration-200"
                  onClick={() => handlePaymentClick(el)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-rose-600 text-lg">☕</span>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          {el.quantity}개
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-rose-600">
                        {el.price}
                      </span>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <div className="relative w-3 h-3">
                          <Image
                            src={'/icons/Vector.png'}
                            alt="화살표"
                            fill
                            className="opacity-50"
                          />
                        </div>
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
