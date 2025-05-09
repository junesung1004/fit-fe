'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { confirmPayment } from '@/services/payment';

function SuccessContent() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const searchParams = useSearchParams();
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const customerEmail = searchParams.get('customerEmail');
  const customerName = searchParams.get('customerName');
  const customerMobilePhone = searchParams.get('customerMobilePhone');

  console.log('결제 성공:', {
    paymentKey,
    orderId,
    amount,
    customerEmail,
    customerName,
    customerMobilePhone,
  });

  const handleConfirmPayment = async () => {
    try {
      if (
        !paymentKey ||
        !orderId ||
        !amount ||
        !customerEmail ||
        !customerName ||
        !customerMobilePhone
      ) {
        throw new Error('필수 결제 정보가 누락되었습니다.');
      }

      await confirmPayment({
        paymentKey,
        orderId,
        amount: Number(amount),
        customerEmail,
        customerName,
        customerMobilePhone,
      });

      setIsConfirmed(true);
    } catch (error) {
      console.error('결제 승인 실패:', error);
      // TODO: 에러 처리 (예: 에러 메시지 표시)
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col gap-10 items-center justify-center">
      <div className="flex flex-col gap-6 w-full px-14">
        <h1 className="text-2xl font-bold text-center">
          결제가 완료되었습니다!
        </h1>
        <div className="flex flex-col gap-2">
          <p>주문번호: {orderId}</p>
          <p>결제금액: {amount}원</p>
        </div>
      </div>
      {isConfirmed ? (
        <div className="flex flex-col items-center max-w-[540px] w-full">
          <Image
            src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
            alt="결제 성공"
            width={120}
            height={120}
          />
          <h2 className="mt-8 text-2xl font-bold text-gray-900">
            결제를 완료했어요
          </h2>

          <div className="w-full mt-16 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-700">결제 금액</span>
              <span className="text-gray-900">{amount}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">주문번호</span>
              <span className="text-gray-900">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">paymentKey</span>
              <span className="text-gray-900">{paymentKey}</span>
            </div>
          </div>

          <div className="flex gap-4 mt-8 w-full">
            <Link
              href="/mypage/payment"
              className="flex-1 py-3 text-center text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              결제 페이지로
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center max-w-[540px] w-full">
          <Image
            src="https://static.toss.im/lotties/loading-spot-apng.png"
            alt="로딩중"
            width={120}
            height={120}
          />
          <h2 className="mt-8 text-2xl font-bold text-gray-900">
            결제 요청까지 성공했어요
          </h2>
          <p className="mt-2 text-gray-600">결제 승인하고 완료해보세요</p>

          <button
            onClick={handleConfirmPayment}
            className="w-full mt-8 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            결제 승인하기
          </button>
        </div>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
