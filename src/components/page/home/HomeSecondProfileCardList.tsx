'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import HomeProfileCard from './HomeProfileCard';
import Mbti from '@/components/common/Mbti';
import Button from '@/components/common/Button';
import { UserDataType } from '@/types/homePage.type';
import { selectMatchUser } from '@/services/todayDatingMatch';

interface SecondProps {
  thirdUser: UserDataType | null;
  fourUser: UserDataType | null;
  onSelectAll: () => void; // 부모에서 받은 함수
}

export default function HomeSecondProfileCardList({
  thirdUser,
  fourUser,
  onSelectAll,
}: SecondProps) {
  const router = useRouter();
  if (!thirdUser || !fourUser) return null;

  const getKoreanAge = (birthday: number): number => {
    const birthYear = new Date(birthday).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear + 1;
  };

  const handleSelect = async (selectedUserId: number) => {
    if (!thirdUser.matchId) {
      console.error('matchId가 없습니다.');
      return;
    }
    try {
      await selectMatchUser({
        matchId: thirdUser.matchId,
        selectedUserId: selectedUserId.toString(),
      });
      console.log('선택 성공');
    } catch (err) {
      console.error('매칭 선택 실패:', err);
    }
  };

  const moveToDetail = (id: number) => {
    router.push(`/members/${id}`);
  };

  const thirdImg = thirdUser.profile.profileImage?.[0]?.imageUrl ?? '/default.png';
  const fourImg = fourUser.profile.profileImage?.[1]?.imageUrl
    ?? fourUser.profile.profileImage?.[0]?.imageUrl
    ?? '/default.png';

  return (
    <div className="flex flex-col gap-3 p-4 border shadow-xl rounded-xl mt-6">
      <div className="relative flex gap-3">
        <HomeProfileCard
          onClick={() => moveToDetail(thirdUser.id)}
          backgroundImageUrl={thirdImg}
        >
          <HomeProfileCard.Header>
            <Mbti>{thirdUser.profile.mbti.mbti}</Mbti>
          </HomeProfileCard.Header>
          <HomeProfileCard.Body>
            <p className="text-cyan-200">{thirdUser.nickname}</p>
            <div className="flex gap-1 text-cyan-200 text-xs">
              <p>{getKoreanAge(thirdUser.birthday)}세</p>
              <p>● {thirdUser.region}</p>
              <p>● {thirdUser.height}cm</p>
            </div>
          </HomeProfileCard.Body>
          <HomeProfileCard.Footer>
            <Button
              size="full"
              rounded="full"
              variant="outline"
              onClick={e => {
                e.stopPropagation();
                void handleSelect(thirdUser.id);
              }}
            >
              선택하기
            </Button>
          </HomeProfileCard.Footer>
        </HomeProfileCard>

        <div className="absolute left-1/2 top-1/2 
                        -translate-x-1/2 -translate-y-1/2 
                        w-12 h-12 flex justify-center items-center 
                        shadow-xl bg-white rounded-full border 
                        text-rose-500 font-bold z-10">
          V S
        </div>

        <HomeProfileCard
          onClick={() => moveToDetail(fourUser.id)}
          backgroundImageUrl={fourImg}
        >
          <HomeProfileCard.Header>
            <Mbti>{fourUser.profile.mbti.mbti}</Mbti>
          </HomeProfileCard.Header>
          <HomeProfileCard.Body>
            <p className="text-cyan-200">{fourUser.nickname}</p>
            <div className="flex gap-1 text-cyan-200 text-xs">
              <p>{getKoreanAge(fourUser.birthday)}세</p>
              <p>● {fourUser.region}</p>
              <p>● {fourUser.height}cm</p>
            </div>
          </HomeProfileCard.Body>
          <HomeProfileCard.Footer>
            <Button
              size="full"
              rounded="full"
              variant="outline"
              onClick={e => {
                e.stopPropagation();
                void handleSelect(fourUser.id);
              }}
            >
              선택하기
            </Button>
          </HomeProfileCard.Footer>
        </HomeProfileCard>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-center items-center gap-3">
        <Button rounded="full" variant="outline" onClick={() => console.log('취소')}>
          X
        </Button>
        <Button rounded="full" size="full" onClick={onSelectAll}>
          모두 선택
        </Button>
      </div>
    </div>
  );
}
