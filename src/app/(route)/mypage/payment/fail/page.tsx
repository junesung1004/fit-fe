'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Spinner from '@/components/common/Spinner';

function FailContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <Image
                src="https://static.toss.im/lotties/error-spot-apng.png"
                alt="결제 실패"
                width={80}
                height={80}
                className="animate-pulse"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              결제를 실패했어요
            </h2>
            <p className="text-gray-600 mb-8">다시 시도해주세요</p>
          </div>

          <div className="space-y-4 bg-gray-50 p-6 rounded-xl mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">에러 코드</span>
              <span className="text-gray-900 font-mono">{errorCode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">에러 메시지</span>
              <span className="text-gray-900 text-right max-w-[300px]">
                {errorMessage}
              </span>
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
      </div>
    </div>
  );
}

export default function FailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <FailContent />
    </Suspense>
  );
}
