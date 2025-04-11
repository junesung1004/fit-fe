'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home');
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="">
        <Image
          src={'/샘플랜딩페이지.png'}
          alt="샘플랜딩페이지"
          width={900}
          height={900}
        />
      </div>
    </div>
  );
}
