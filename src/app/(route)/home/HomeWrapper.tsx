'use client';

import Button from '@/components/common/Button';
import HomeProfileCardList from '@/components/page/home/HomeProfileCardList';
import React from 'react';

export default function HomeWrapper() {
  return (
    <main className="p-10">
      <h1>홈 페이지입니다⭐👀👀⭐</h1>
      <HomeProfileCardList />
      <Button
        size="lg"
        variant="outline"
        rounded="full"
        color="violet"
        onClick={() => console.log('클릭')}
      >
        클릭
      </Button>
    </main>
  );
}
