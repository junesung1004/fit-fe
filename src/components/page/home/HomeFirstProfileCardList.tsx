'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import HomeProfileCard from './HomeProfileCard';
import Mbti from '@/components/common/Mbti';
import Button from '@/components/common/Button';
import { UserDataType } from '@/types/homePage.type';
import {
  selectMatchUser,
  selectAllMatchUser,
} from '@/services/todayDatingMatch';

interface FirstProps {
  firstUser: UserDataType | null;
  secondUser: UserDataType | null;
  onSelectAll: () => void;
  // eslint-disable-next-line no-unused-vars
  onProfileSelect: (userId: number) => void;
  selectedProfiles: Set<number>;
}

export default function HomeFirstProfileCardList({
  firstUser,
  secondUser,
  onSelectAll,
  onProfileSelect,
  selectedProfiles,
}: FirstProps) {
  const router = useRouter();

  if (!firstUser || !secondUser) return null;

  const getKoreanAge = (birthday: number): number => {
    const birthYear = new Date(birthday).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear + 1;
  };

  // 일반 선택을 위한 핸들러
  const handleSelect = async (selectedId: number) => {
    if (!firstUser.matchId) return;
    try {
      // selectMatchUser를 사용하여 선택된 유저를 서버에 반영
      await selectMatchUser({
        matchId: firstUser.matchId,
        selectedUserId: selectedId.toString(),
      });
      onProfileSelect(selectedId); // 프로필 선택 처리
    } catch (err) {
      console.error('매칭 선택 실패:', err);
    }
  };

  // 모두 선택 핸들러
  const handleSelectAllLocal = async () => {
    if (!firstUser || !secondUser || !firstUser.matchId) return;
    try {
      await selectAllMatchUser({
        matchId: firstUser.matchId,
        firstSelectedUserId: firstUser.id.toString(),
        secondSelectedUserId: secondUser.id.toString(),
      });
      onSelectAll(); // 원래 부모 콜백 호출
    } catch (err) {
      console.error('모두 선택 실패:', err);
    }
  };

  const moveToDetail = (id: number) => {
    router.push(`/members/${id}`);
  };

  const firstImg =
    firstUser.profile.profileImage?.[0]?.imageUrl ?? '/default.png';
  const secondImg =
    secondUser.profile.profileImage?.[1]?.imageUrl ??
    secondUser.profile.profileImage?.[0]?.imageUrl ??
    '/default.png';

  return (
    <div
      className={`flex flex-col gap-3 p-4 border shadow-xl rounded-xl mt-6 ${selectedProfiles.size > 0 ? 'bg-rose-100' : ''}`}
    >
      <div className="relative flex gap-3">
        {/* 첫 번째 카드 */}
        {!selectedProfiles.has(firstUser.id) && (
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
                disabled={selectedProfiles.has(firstUser.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(firstUser.id); // 프로필 선택
                }}
              >
                {selectedProfiles.has(firstUser.id) ? '선택함' : '선택하기'}
              </Button>
            </HomeProfileCard.Footer>
          </HomeProfileCard>
        )}

        {/* VS 표시 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex justify-center items-center shadow-xl bg-white rounded-full border text-rose-500 font-bold z-10">
          V S
        </div>

        {/* 두 번째 카드 */}
        {!selectedProfiles.has(secondUser.id) && (
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
                disabled={selectedProfiles.has(secondUser.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(secondUser.id); // 프로필 선택
                }}
              >
                {selectedProfiles.has(secondUser.id) ? '선택함' : '선택하기'}
              </Button>
            </HomeProfileCard.Footer>
          </HomeProfileCard>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-center items-center gap-3">
        <Button
          rounded="full"
          variant="outline"
          onClick={() => console.log('취소')}
        >
          X
        </Button>
        <Button rounded="full" size="full" onClick={handleSelectAllLocal}>
          모두 선택
        </Button>
      </div>
    </div>
  );
}
