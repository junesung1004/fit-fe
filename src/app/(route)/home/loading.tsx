'use client';

import Spinner from '@/components/common/Spinner';

export default function Loading() {
  return (
    <div className="w-full h-[calc(100vh-160px)] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
