'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import HomeProfileCard from './HomeProfileCard';
import Mbti from '@/components/common/Mbti';
import Button from '@/components/common/Button';
import { UserDataType } from '@/types/homePage.type';
import {
  selectMatchUser,
  selectAllMatchUser,
} from '@/services/todayDatingMatch';
import { useAuthStore } from '@/store/authStore';
import LoginRequiredModal from '@/components/common/LoginRequiredModal';
import { passBothUsers } from '@/services/passMatch';
import { isAxiosError } from '@/lib/error';
import { toast } from 'react-toastify';

interface FirstProps {
  firstUser: UserDataType | null;
  secondUser: UserDataType | null;
  onSelectAll: () => void;
}

export default function HomeFirstProfileCardList({
  firstUser,
  secondUser,
  onSelectAll,
}: FirstProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [selectedFirst, setSelectedFirst] = useState(false);
  const [selectedSecond, setSelectedSecond] = useState(false);
  const [isListSelected, setIsListSelected] = useState(false);

  if (!firstUser || !secondUser) return null;

  const getKoreanAge = (birthday: number): number => {
    const birthYear = new Date(birthday).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear + 1;
  };

  const handleSelect = async (selectedId: number, type: 'first' | 'second') => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }

    if (!firstUser.matchId) {
      toast.error('매칭 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      await selectMatchUser({
        matchId: firstUser.matchId,
        selectedUserId: selectedId.toString(),
      });

      if (type === 'first') {
        setSelectedFirst(true);
      } else {
        setSelectedSecond(true);
      }

      // ✅ 한 명만 선택해도 "선택 완료" 오버레이 띄우기
      setIsListSelected(true);

      // ✅ 둘 다 선택됐을 때만 select-all API 호출
      if (type === 'first' && selectedSecond) {
        onSelectAll();
      }
      if (type === 'second' && selectedFirst) {
        onSelectAll();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || '매칭 선택에 실패했습니다.'
        );
      } else {
        toast.error('매칭 선택에 실패했습니다.');
      }
    }
  };

  const handleSelectAllLocal = async () => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }

    if (!firstUser || !secondUser || !firstUser.matchId) return;

    try {
      await selectAllMatchUser({
        matchId: firstUser.matchId,
        firstSelectedUserId: firstUser.id.toString(),
        secondSelectedUserId: secondUser.id.toString(),
      });

      setSelectedFirst(true);
      setSelectedSecond(true);
      setIsListSelected(true);
      onSelectAll();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || '모두 선택에 실패했습니다.'
        );
      } else {
        toast.error('모두 선택에 실패했습니다.');
      }
    }
  };

  const handlePassBoth = async () => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }

    try {
      await passBothUsers(firstUser.id.toString(), secondUser.id.toString());
      setIsListSelected(true);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || '거절에 실패했습니다.');
      } else {
        toast.error('거절에 실패했습니다.');
      }
    }
  };

  const moveToDetail = (id: number) => {
    if (!isListSelected) {
      router.push(`/members/${id}`);
    }
  };

  const firstImg =
    firstUser?.profile?.profileImage?.[0]?.imageUrl ?? '/default.png';
  const secondImg =
    secondUser?.profile?.profileImage?.[1]?.imageUrl ??
    secondUser?.profile?.profileImage?.[0]?.imageUrl ??
    '/default.png';

  return (
    <div className="flex flex-col gap-3 p-4 border shadow-xl rounded-xl mt-6 bg-white relative">
      {isListSelected && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center rounded-xl z-20">
          <p className="text-white text-2xl font-bold">
            {selectedFirst || selectedSecond ? '선택 완료' : '거절 완료'}
          </p>
        </div>
      )}

      <div className="relative flex gap-3 z-10">
        {/* 첫 번째 카드 */}
        <div className="relative w-full">
          <HomeProfileCard
            onClick={() => moveToDetail(firstUser.id)}
            backgroundImageUrl={firstImg}
          >
            <HomeProfileCard.Header>
              <Mbti>{firstUser?.profile?.mbti?.mbti ?? 'MBTI'}</Mbti>
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
                size="md-full"
                rounded="full"
                variant="outline"
                disabled={isListSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isListSelected) {
                    void handleSelect(firstUser.id, 'first');
                  }
                }}
              >
                {selectedFirst ? '선택함' : '선택하기'}
              </Button>
            </HomeProfileCard.Footer>
          </HomeProfileCard>
        </div>

        {/* VS 표시 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex justify-center items-center shadow-xl bg-white rounded-full border text-rose-500 font-bold z-20">
          V S
        </div>

        {/* 두 번째 카드 */}
        <div className="relative w-full">
          <HomeProfileCard
            onClick={() => moveToDetail(secondUser.id)}
            backgroundImageUrl={secondImg}
          >
            <HomeProfileCard.Header>
              <Mbti>{secondUser?.profile?.mbti?.mbti ?? 'MBTI'}</Mbti>
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
                size="md-full"
                rounded="full"
                variant="outline"
                disabled={isListSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isListSelected) {
                    void handleSelect(secondUser.id, 'second');
                  }
                }}
              >
                {selectedSecond ? '선택함' : '선택하기'}
              </Button>
            </HomeProfileCard.Footer>
          </HomeProfileCard>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-center items-center gap-3 mt-4 z-10">
        <Button
          rounded="full"
          variant="outline"
          onClick={handlePassBoth}
          disabled={isListSelected}
        >
          X
        </Button>

        <Button
          rounded="full"
          size="md-full"
          onClick={handleSelectAllLocal}
          disabled={isListSelected}
        >
          모두 선택
        </Button>
      </div>

      {/* 공통 로그인 모달 */}
      {showLoginAlert && (
        <LoginRequiredModal onClose={() => setShowLoginAlert(false)} />
      )}
    </div>
  );
}
