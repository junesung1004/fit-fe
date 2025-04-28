'use client';

import React, { useEffect, useState } from 'react';
import HomeFirstProfileCardList from '@/components/page/home/HomeFirstProfileCardList';
import HomeTwoProfileCardList from '@/components/page/home/HomeSecondProfileCardList';
import {
  usePublicTodayDatingMatchMutation,
  useTodayDatingMatchMutation,
} from '@/hooks/mutation/useTodayDatingMatchMutation';
import { useAuthStore } from '@/store/authStore';
import { UserDataType } from '@/types/homePage.type';

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
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);

  const { mutate: todayDatingUser } = useTodayDatingMatchMutation();
  const { mutate: publicTodayDatingUser } = usePublicTodayDatingMatchMutation();

  // 🌟 숨겨진 ID localStorage에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('hiddenUserIds');
    if (saved) setHiddenIds(JSON.parse(saved));
  }, []);

  // 🌟 숨겨야 하는 ID들 필터링 후 유저 설정
  const setUsersWithFilter = (matches: MatchItem[]) => {
    if (matches.length > 0) {
      const { matchId, user1, user2 } = matches[0];
      setFirstUser(hiddenIds.includes(user1.id) ? null : { ...user1, matchId });
      setTwoUser(hiddenIds.includes(user2.id) ? null : { ...user2, matchId });
    }
    if (matches.length > 1) {
      const { matchId, user1, user2 } = matches[1];
      setThirdUser(hiddenIds.includes(user1.id) ? null : { ...user1, matchId });
      setFourUser(hiddenIds.includes(user2.id) ? null : { ...user2, matchId });
    }
  };

  // 🌐 비로그인 유저용 데이터
  const getPublicTodayDatingUserMatch = () => {
    publicTodayDatingUser(undefined, {
      onSuccess: (data: { matches: MatchItem[] }) => {
        setUsersWithFilter(data.matches);
      },
    });
  };

  // 🔐 로그인 유저용 데이터
  const getTodayDatingUserMatch = () => {
    todayDatingUser(undefined, {
      onSuccess: (data: { matches: MatchItem[] }) => {
        setUsersWithFilter(data.matches);
      },
    });
  };

  // 로그인 상태에 따라 데이터 불러오기
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      const currentIsLoggedIn = state.isLoggedIn;
      const hasApiBeenCalled = firstUser !== null || twoUser !== null;
      if (hasApiBeenCalled) return;

      if (currentIsLoggedIn) getTodayDatingUserMatch();
      else getPublicTodayDatingUserMatch();
    });

    const currentIsLoggedIn = useAuthStore.getState().isLoggedIn;
    if (currentIsLoggedIn !== null) {
      if (currentIsLoggedIn) getTodayDatingUserMatch();
      else getPublicTodayDatingUserMatch();
    }

    return () => unsubscribe();
  }, [hiddenIds]);

  // 🌟 유저 선택 시 숨기기 + 저장
  const handleUsersSelected = (selectedIds: number[]) => {
    const updatedHidden = [...hiddenIds, ...selectedIds];
    setHiddenIds(updatedHidden);
    localStorage.setItem('hiddenUserIds', JSON.stringify(updatedHidden));
  };

  return (
    <main className="p-3">
      <h1 className="text-lg font-semibold">매일 오전 10시</h1>
      <small className="text-slate-400">당신을 기다리는 인연이 도착합니다.</small>

      {firstUser && twoUser && (
        <HomeFirstProfileCardList
          firstUser={firstUser}
          secondUser={twoUser}
          onUsersSelected={handleUsersSelected}
        />
      )}

      {thirdUser && fourUser && (
        <HomeTwoProfileCardList
          thirdUser={thirdUser}
          fourUser={fourUser}
          onUsersSelected={handleUsersSelected}
        />
      )}
    </main>
  );
}
