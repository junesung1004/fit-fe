'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function FailPage() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="flex flex-col items-center max-w-[540px] w-full">
        <Image
          src="https://static.toss.im/lotties/error-spot-apng.png"
          alt="결제 실패"
          width={120}
          height={120}
        />
        <h2 className="mt-8 text-2xl font-bold text-gray-900">
          결제를 실패했어요
        </h2>

        <div className="w-full mt-16 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-700">에러 코드</span>
            <span className="text-gray-900">{errorCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">에러 메시지</span>
            <span className="text-gray-900">{errorMessage}</span>
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
    </div>
  );
}
