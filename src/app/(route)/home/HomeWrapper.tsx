'use client';

import HomeFristProfileCardList from '@/components/page/home/HomeFirstProfileCardList';
import HomeTwoProfileCardList from '@/components/page/home/HomeSecondProfileCardList';
import {
  usePublicTodayDatingMatchQuery,
  useTodayDatingMatchQuery,
} from '@/hooks/query/useTodayDatingMatchQuery';
import { selectAllMatchUser } from '@/services/todayDatingMatch';
import { useAuthStore } from '@/store/authStore';
import { UserDataType } from '@/types/homePage.type';
import React, { useEffect, useState } from 'react';

interface MatchItem {
  matchId: string;
  user1: UserDataType;
  user2: UserDataType;
}

export default function HomeWrapper() {
  const [firstUser, setFirstUser] = useState<UserDataType | null>(null);
  const [twoUser, setTwoUser] = useState<UserDataType | null>(null);
  const [thirdUser, setThirdUser] = useState<UserDataType | null>(null);
  const [fourUser, setFourUser] = useState<UserDataType | null>(null);
  const [selectedProfiles, setSelectedProfiles] = useState<Set<number>>(
    new Set()
  ); // 선택된 프로필 관리

  const { data: todayDatingData, isError: isTodayDatingError } =
    useTodayDatingMatchQuery();
  const { data: publicTodayDatingData, isError: isPublicTodayDatingError } =
    usePublicTodayDatingMatchQuery();

  // 비로그인 유저용 API 호출 함수
  const getPublicTodayDatingUserMatch = (matches: MatchItem[]) => {
    if (matches.length > 0) {
      const { matchId, user1, user2 } = matches[0];
      setFirstUser({ ...user1, matchId });
      setTwoUser({ ...user2, matchId });
    }
    if (matches.length > 1) {
      const { matchId, user1, user2 } = matches[1];
      setThirdUser({ ...user1, matchId });
      setFourUser({ ...user2, matchId });
    }
  };

  // 로그인 유저용 API 호출 함수
  const getTodayDatingUserMatch = (matches: MatchItem[]) => {
    if (matches.length > 0) {
      const { matchId, user1, user2 } = matches[0];
      setFirstUser({ ...user1, matchId });
      setTwoUser({ ...user2, matchId });
    }
    if (matches.length > 1) {
      const { matchId, user1, user2 } = matches[1];
      setThirdUser({ ...user1, matchId });
      setFourUser({ ...user2, matchId });
    }
  };

  // Zustand subscribe를 사용하여 로그인 상태 변경 감지
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      const currentIsLoggedIn = state.isLoggedIn;
      if (currentIsLoggedIn === null) return;

      const hasApiBeenCalled = firstUser !== null || twoUser !== null;
      if (hasApiBeenCalled) return;

      // 데이터가 없으면 API를 호출
      if (currentIsLoggedIn) {
        console.log('로그인 유저 매칭 데이터 가져오기');
        getTodayDatingUserMatch(todayDatingData?.matches || []);
      } else {
        console.log('비로그인 유저 매칭 데이터 가져오기');
        getPublicTodayDatingUserMatch(publicTodayDatingData?.matches || []);
      }
    });

    const currentIsLoggedIn = useAuthStore.getState().isLoggedIn;
    if (currentIsLoggedIn !== null) {
      // 이미 프로필 정보가 있으면 API 호출하지 않음
      if (!firstUser && !twoUser && !thirdUser && !fourUser) {
        if (currentIsLoggedIn) {
          console.log('초기 로그인 유저 매칭 데이터 가져오기');
          getTodayDatingUserMatch(todayDatingData?.matches || []);
        } else {
          console.log('초기 비로그인 유저 매칭 데이터 가져오기');
          getPublicTodayDatingUserMatch(publicTodayDatingData?.matches || []);
        }
      }
    }

    return () => {
      unsubscribe();
    };
  }, [
    todayDatingData,
    publicTodayDatingData,
    firstUser,
    twoUser,
    thirdUser,
    fourUser,
  ]);

  // 에러 처리
  useEffect(() => {
    if (isTodayDatingError) {
      console.error('❌ 오늘의 데이팅 회원 조회 실패');
    }
    if (isPublicTodayDatingError) {
      console.error('❌ 비로그인 오늘의 데이팅 회원 조회 실패');
    }
  }, [isTodayDatingError, isPublicTodayDatingError]);

  // 프로필 선택 상태 업데이트
  const handleProfileSelect = (userId: number) => {
    setSelectedProfiles((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(userId)) {
        newSelected.delete(userId); // 선택 해제
      } else {
        newSelected.add(userId); // 선택
      }
      sessionStorage.setItem(
        'selectedProfiles',
        JSON.stringify(Array.from(newSelected))
      ); // 상태를 sessionStorage에 저장
      return newSelected;
    });
  };

  const handleSelectAll = async () => {
    if (!firstUser || !twoUser || !firstUser.matchId) return;

    try {
      await selectAllMatchUser({
        matchId: firstUser.matchId,
        firstSelectedUserId: firstUser.id.toString(),
        secondSelectedUserId: twoUser.id.toString(),
      });
      setSelectedProfiles(new Set([firstUser.id, twoUser.id])); // 모두 선택 상태로 업데이트
      sessionStorage.setItem(
        'selectedProfiles',
        JSON.stringify([firstUser.id, twoUser.id])
      ); // 상태를 sessionStorage에 저장
    } catch (err) {
      console.error('모두 선택 실패:', err);
    }
  };

  // 새로고침 시 선택된 프로필 불러오기
  useEffect(() => {
    const savedProfiles = sessionStorage.getItem('selectedProfiles');
    if (savedProfiles) {
      setSelectedProfiles(new Set(JSON.parse(savedProfiles)));
    }
  }, []);

  // 모두 선택되었을 경우 메시지 표시
  const allProfilesSelected = selectedProfiles.size === 4;

  return (
    <main className="p-3">
      <h1 className="text-lg font-semibold">매일 오전 10시</h1>
      <small className="text-slate-400">
        당신을 기다리는 인연이 도착합니다.
      </small>

      {/* 홈 화면에서 선택되지 않은 프로필만 보여줌 */}
      {allProfilesSelected ? (
        <div className="mt-6 text-center text-lg font-semibold text-green-500">
          오늘 주어진 이성을 모두 선택하셨습니다💓
        </div>
      ) : (
        <>
          <HomeFristProfileCardList
            firstUser={firstUser}
            secondUser={twoUser}
            onSelectAll={handleSelectAll}
            onProfileSelect={handleProfileSelect}
            selectedProfiles={selectedProfiles}
          />
          <HomeTwoProfileCardList
            thirdUser={thirdUser}
            fourUser={fourUser}
            onSelectAll={handleSelectAll}
            onProfileSelect={handleProfileSelect}
            selectedProfiles={selectedProfiles}
          />
        </>
      )}
    </main>
  );
}
