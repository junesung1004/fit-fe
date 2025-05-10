'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { confirmPayment } from '@/services/payment';
import Spinner from '@/components/common/Spinner';
import { isAxiosError } from '@/lib/error';
import { toast } from 'react-toastify';

function SuccessContent() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const searchParams = useSearchParams();
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const customerEmail = searchParams.get('customerEmail');
  const customerName = searchParams.get('customerName');
  const customerMobilePhone = searchParams.get('customerMobilePhone');

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
        toast.error('필수 결제 정보가 누락되었습니다.');
        return;
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
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage || '결제 승인에 실패했습니다.');
      } else {
        toast.error('결제 승인에 실패했습니다.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {isConfirmed ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <Image
                  src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
                  alt="결제 성공"
                  width={50}
                  height={50}
                  className="animate-bounce"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                결제를 완료했어요
              </h2>
              <p className="text-gray-600 mb-8">커피 아이템이 충전되었습니다</p>
            </div>

            <div className="space-y-4 bg-gray-50 p-6 rounded-xl mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">결제 금액</span>
                <span className="text-xl font-bold text-gray-900">
                  {Number(amount).toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">주문번호</span>
                <span className="text-gray-900 font-mono">{orderId}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                href="/mypage/payment"
                className="flex-1 py-4 text-center text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                결제 페이지로
              </Link>
              <Link
                href="/mypage"
                className="flex-1 py-4 text-center text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-medium"
              >
                마이페이지로
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <Image
                  src="https://static.toss.im/lotties/loading-spot-apng.png"
                  alt="로딩중"
                  width={50}
                  height={50}
                  className="animate-spin"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                결제 요청까지 성공했어요
              </h2>
              <p className="text-gray-600 mb-8">결제 승인하고 완료해보세요</p>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full py-4 text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-medium"
            >
              결제 승인하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
