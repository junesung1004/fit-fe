'use client';

import React from 'react';
import HomeProfileCard from './HomeProfileCard';
import Mbti from '@/components/common/Mbti';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';

export default function HomeProfileCardList() {
  const router = useRouter();
  const handleCickMemberDetailMove = (id: string) => {
    router.push(`/members/${id}`);
  };
  return (
    <div className="flex gap-3">
      {/* 왼쪽 프로필 */}
      <HomeProfileCard
        onClick={() => handleCickMemberDetailMove('123')}
        backgroundImageUrl="/cha.jpg"
      >
        <HomeProfileCard.Header>
          <Mbti>INFP</Mbti>
        </HomeProfileCard.Header>
        <HomeProfileCard.Body>
          <p className="text-white">박준성</p>
          <div className="flex xs2:flex-col xs:flex-row gap-1 text-white text-xs">
            <p>32세</p>
            <p>● 인천</p>
            <p>● 160cm</p>
          </div>
        </HomeProfileCard.Body>
        <HomeProfileCard.Footer>
          <Button
            size="full"
            rounded="full"
            variant="outline"
            onClick={(event) => event.stopPropagation()}
          >
            선택하기
          </Button>
        </HomeProfileCard.Footer>
      </HomeProfileCard>

      {/* 오른쪽 프로필 */}
      <HomeProfileCard
        onClick={() => handleCickMemberDetailMove('123')}
        backgroundImageUrl="/june.jpg"
      >
        <HomeProfileCard.Header>
          <Mbti>INFP</Mbti>
        </HomeProfileCard.Header>
        <HomeProfileCard.Body>
          <p className="text-white">박준성</p>
          <div className="flex xs2:flex-col xs:flex-row gap-1 text-white text-xs">
            <p>32세</p>
            <p>● 인천</p>
            <p>● 160cm</p>
          </div>
        </HomeProfileCard.Body>
        <HomeProfileCard.Footer>
          <Button
            size="full"
            rounded="full"
            variant="outline"
            onClick={(e) => e.stopPropagation()}
          >
            선택하기
          </Button>
        </HomeProfileCard.Footer>
      </HomeProfileCard>
    </div>
  );
}
