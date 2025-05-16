'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface BackButtonProps {
  className?: string; // 위치 조정 등 커스텀을 위해
  color?: string;     // 아이콘 색상 조정
}

export default function BackButton({
  className = 'absolute top-4 left-6',
  color = 'text-gray-500',
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button onClick={handleBack} className={className}>
      <ArrowLeftIcon className={`w-6 h-6 ${color}`} />
    </button>
  );
}
