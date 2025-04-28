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
  const [firstCardHidden, setFirstCardHidden] = useState<boolean>(false);
  const [secondCardHidden, setSecondCardHidden] = useState<boolean>(false);

  const { mutate: todayDatingUser } = useTodayDatingMatchMutation();
  const { mutate: publicTodayDatingUser } = usePublicTodayDatingMatchMutation();

  // 🌟 숨겨진 ID 및 카드 상태 localStorage에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('hiddenUserIds');
    const savedFirstHidden = localStorage.getItem('firstCardHidden');
    const savedSecondHidden = localStorage.getItem('secondCardHidden');
    if (saved) setHiddenIds(JSON.parse(saved));
    if (savedFirstHidden === 'true') setFirstCardHidden(true);
    if (savedSecondHidden === 'true') setSecondCardHidden(true);
  }, []);

  // 🌟 숨겨야 하는 ID들 필터링 후 유저 설정
  const setUsersWithFilter = (matches: MatchItem[]) => {
    if (matches.length > 0 && !firstCardHidden) {
      const { matchId, user1, user2 } = matches[0];
      setFirstUser(hiddenIds.includes(user1.id) ? null : { ...user1, matchId });
      setTwoUser(hiddenIds.includes(user2.id) ? null : { ...user2, matchId });
    }
    if (matches.length > 1 && !secondCardHidden) {
      const { matchId, user1, user2 } = matches[1];
      // 첫 카드에서 선택된 id들이 두 번째 카드에 보이지 않게 필터
      if (!hiddenIds.includes(user1.id) && !hiddenIds.includes(user2.id)) {
        setThirdUser({ ...user1, matchId });
        setFourUser({ ...user2, matchId });
      } else {
        setThirdUser(null);
        setFourUser(null);
      }
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
  }, [hiddenIds, firstCardHidden, secondCardHidden]);

  // 🌟 유저 선택 시 숨기기 + 저장
  const handleUsersSelected = (selectedIds: number[], fromFirstCard: boolean) => {
    const updatedHidden = [...hiddenIds, ...selectedIds];
    setHiddenIds(updatedHidden);
    localStorage.setItem('hiddenUserIds', JSON.stringify(updatedHidden));

    if (fromFirstCard) {
      setFirstCardHidden(true);
      localStorage.setItem('firstCardHidden', 'true');
    } else {
      setSecondCardHidden(true);
      localStorage.setItem('secondCardHidden', 'true');
    }
  };

  const isAllDone = firstCardHidden && secondCardHidden;

  return (
    <main className="p-3">
      <h1 className="text-lg font-semibold">매일 오전 10시</h1>
      <small className="text-slate-400">당신을 기다리는 인연이 도착합니다.</small>

      {!isAllDone && (
        <>
          {!firstCardHidden && firstUser && twoUser && (
            <HomeFirstProfileCardList
              firstUser={firstUser}
              secondUser={twoUser}
              onUsersSelected={(ids) => handleUsersSelected(ids, true)}
            />
          )}
          {!secondCardHidden && thirdUser && fourUser && (
            <HomeTwoProfileCardList
              thirdUser={thirdUser}
              fourUser={fourUser}
              onUsersSelected={(ids) => handleUsersSelected(ids, false)}
            />
          )}
        </>
      )}

      {isAllDone && (
        <div className="mt-10 text-center text-xl text-violet-500 font-semibold">
          🎉 오늘 월드컵 매칭은 모두 완료되었습니다!
        </div>
      )}
    </main>
  );
}
