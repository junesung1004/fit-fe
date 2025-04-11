'use client';

import Button from '@/components/common/Button';
import React from 'react';

export default function HomeWrapper() {
  return (
    <>
      <h1>홈 페이지입니다⭐👀👀⭐</h1>
      <Button
        size="lg"
        variant="outline"
        color="violet"
        onClick={() => console.log('클릭')}
      >
        클릭
      </Button>
    </>
  );
}
