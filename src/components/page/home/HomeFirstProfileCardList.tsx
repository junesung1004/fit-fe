'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import HomeProfileCard from './HomeProfileCard';
import Mbti from '@/components/common/Mbti';
import Button from '@/components/common/Button';
import { UserDataType } from '@/types/homePage.type';
import { selectMatchUser } from '@/services/todayDatingMatch';

interface FirstProps {
  firstUser: UserDataType | null;
  secondUser: UserDataType | null;
}

export default function HomeFirstProfileCardList({
  firstUser,
  secondUser,
}: FirstProps) {
  const router = useRouter();
  if (!firstUser || !secondUser) return null;

  const getKoreanAge = (birthday: number): number => {
    const birthYear = new Date(birthday).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear + 1;
  };

  const handleSelect = async (selectedUserId: number) => {
    if (!firstUser.matchId) {
      console.error('matchId가 없습니다.');
      return;
    }
    try {
      await selectMatchUser({
        matchId: firstUser.matchId,
        selectedUserId: selectedUserId.toString(),
      });
      // 성공 시 후속 처리...
    } catch (err) {
      console.error('매칭 선택 실패:', err);
    }
  };

  const moveToDetail = (id: number) => {
    router.push(`/members/${id}`);
  };

  // 안전하게 이미지 URL 뽑기
  const firstImg = firstUser.profile.profileImage?.[0]?.imageUrl ?? '/default.png';
  const secondImg = secondUser.profile.profileImage?.[1]?.imageUrl
    ?? secondUser.profile.profileImage?.[0]?.imageUrl
    ?? '/default.png';

  return (
    <div className="flex flex-col gap-3 p-4 border shadow-xl rounded-xl mt-6">
      <div className="relative flex gap-3">
        {/* 왼쪽 */}
        <HomeProfileCard
          onClick={() => moveToDetail(firstUser.id)}
          backgroundImageUrl={firstImg}
        >
          <HomeProfileCard.Header>
            <Mbti>{firstUser.profile.mbti.mbti}</Mbti>
          </HomeProfileCard.Header>
          <HomeProfileCard.Body>
            <p className="text-cyan-200">{firstUser.nickname}</p>
            <div className="flex gap-1 text-cyan-200 text-xs">
              <p>{getKoreanAge(firstUser.birthday)}세</p>
              <p>● {firstUser.region}</p>
              <p>● {firstUser.height}cm</p>
            </div>
          </HomeProfileCard.Body>
          <HomeProfileCard.Footer>
            <Button
              size="full"
              rounded="full"
              variant="outline"
              onClick={e => {
                e.stopPropagation();
                void handleSelect(firstUser.id);
              }}
            >
              선택하기
            </Button>
          </HomeProfileCard.Footer>
        </HomeProfileCard>

        {/* VS 아이콘 */}
        <div className="absolute left-1/2 top-1/2 
                        -translate-x-1/2 -translate-y-1/2 
                        w-12 h-12 flex justify-center items-center 
                        shadow-xl bg-white rounded-full border 
                        text-rose-500 font-bold z-10">
          V S
        </div>

        {/* 오른쪽 */}
        <HomeProfileCard
          onClick={() => moveToDetail(secondUser.id)}
          backgroundImageUrl={secondImg}
        >
          <HomeProfileCard.Header>
            <Mbti>{secondUser.profile.mbti.mbti}</Mbti>
          </HomeProfileCard.Header>
          <HomeProfileCard.Body>
            <p className="text-cyan-200">{secondUser.nickname}</p>
            <div className="flex gap-1 text-cyan-200 text-xs">
              <p>{getKoreanAge(secondUser.birthday)}세</p>
              <p>● {secondUser.region}</p>
              <p>● {secondUser.height}cm</p>
            </div>
          </HomeProfileCard.Body>
          <HomeProfileCard.Footer>
            <Button
              size="full"
              rounded="full"
              variant="outline"
              onClick={e => {
                e.stopPropagation();
                void handleSelect(secondUser.id);
              }}
            >
              선택하기
            </Button>
          </HomeProfileCard.Footer>
        </HomeProfileCard>
      </div>

      {/* 하단 */}
      <div className="flex justify-center items-center gap-3">
        <Button rounded="full" variant="outline" onClick={() => console.log('취소')}>
          X
        </Button>
        <Button rounded="full" size="full" onClick={() => console.log('모두 선택')}>
          모두 선택
        </Button>
      </div>
    </div>
  );
}