'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';

interface Props {
  onClose: () => void;
}

export default function LoginRequiredModal({ onClose }: Props) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-md w-[260px] text-center">
        <p className="text-lg font-semibold mb-6">로그인이 필요합니다</p>
        <div className="flex justify-center gap-4">
          <Button
            size="sm"
            variant="outline"
            color="rose"
            rounded="md"
            onClick={onClose}
          >
            닫기
          </Button>
          <Button
            size="md"
            variant="fill"
            color="rose"
            rounded="md"
            onClick={() => {
              onClose();
              router.push('/login');
            }}
          >
            로그인
          </Button>
        </div>
      </div>
    </div>
  );
}
