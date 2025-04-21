'use client';

import React from 'react';
import HomeProfileCard from './HomeProfileCard';
import Mbti from '@/components/common/Mbti';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import { UserDataType } from '@/app/(route)/home/HomeWrapper';

interface FirstProps {
  firstUser: UserDataType;
  secondUser: UserDataType;
}

export default function HomeFirstProfileCardList({
  firstUser,
  secondUser,
}: FirstProps) {
  const router = useRouter();
  if (!firstUser || !secondUser) return null;

  const handleCickMemberDetailMove = (id: string) => {
    router.push(`/members/${id}`);
  };
  return (
    <div className="flex flex-col gap-3 p-4 border shadow-xl rounded-xl mt-6">
      {/* 프로필 영역*/}
      <div className="relative flex gap-3">
        {/* 왼쪽 프로필 */}
        <HomeProfileCard
          onClick={() => handleCickMemberDetailMove('123')}
          backgroundImageUrl={firstUser.image}
        >
          <HomeProfileCard.Header>
            <Mbti>{firstUser.mbti}</Mbti>
          </HomeProfileCard.Header>
          <HomeProfileCard.Body>
            <p className="text-white">{firstUser.nickname}</p>
            <div className="flex xs2:flex-col xs:flex-row gap-1 text-white text-xs">
              <p>{firstUser.age}세</p>
              <p>● {firstUser.region}</p>
              <p>● {firstUser.height}cm</p>
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

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex justify-center items-center shadow-xl bg-white rounded-full border text-rose-500 font-bold z-10">
          V S
        </div>

        {/* 오른쪽 프로필 */}
        <HomeProfileCard
          onClick={() => handleCickMemberDetailMove('123')}
          backgroundImageUrl={secondUser.image}
        >
          <HomeProfileCard.Header>
            <Mbti>{secondUser.mbti}</Mbti>
          </HomeProfileCard.Header>
          <HomeProfileCard.Body>
            <p className="text-white">{secondUser.nickname}</p>
            <div className="flex xs2:flex-col xs:flex-row gap-1 text-white text-xs">
              <p>{secondUser.age}세</p>
              <p>● {secondUser.region}</p>
              <p>● {secondUser.height}cm</p>
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

      {/* 버튼 영역 */}
      <div className="flex justify-center items-center gap-3">
        <Button rounded="full" variant="outline">
          X
        </Button>
        <Button rounded="full" size="full">
          모두 선택
        </Button>
      </div>
    </div>
  );
}
