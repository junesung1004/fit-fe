'use client';

import HomeFristProfileCardList from '@/components/page/home/HomeFirstProfileCardList';
import HomeTwoProfileCardList from '@/components/page/home/HomeSecondProfileCardList';
import {
  usePublicTodayDatingMatchMutation,
  useTodayDatingMatchMutation,
} from '@/hooks/mutation/useTodayDatingMatchMutation';
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
  console.log('thirdUser : ', thirdUser);
  const [fourUser, setFourUser] = useState<UserDataType | null>(null);
  console.log('fourUser : ', fourUser);
  const { mutate: todayDatingUser } = useTodayDatingMatchMutation();
  const { mutate: publicTodayDatingUser } = usePublicTodayDatingMatchMutation();
  const {} = useAuthStore();

  // 🌐 비로그인 유저용 API 호출 함수
  const getPublicTodayDatingUserMatch = () => {
    publicTodayDatingUser(undefined, {
      onSuccess: (data: { matches: MatchItem[] }) => {
        const matches = data.matches;
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
      },
      onError: (err) => {
        console.error('❌ 매칭 데이터 가져오기 실패 (비로그인)', err);
      },
    });
  };

  // 🔐 로그인 유저용 API 호출 함수
  const getTodayDatingUserMatch = () => {
    todayDatingUser(undefined, {
      onSuccess: (data: { matches: MatchItem[] }) => {
        const matches = data.matches;
        if (matches.length > 0) {
          const { matchId, user1, user2 } = matches[0];
          setFirstUser({ ...user1, matchId });
          setTwoUser({ ...user2, matchId });
        }
        if (matches.length > 0) {
          const { matchId, user1, user2 } = matches[1];
          setThirdUser({ ...user1, matchId });
          setFourUser({ ...user2, matchId });
        }
      },
      onError: (err) => {
        console.error('❌ 매칭 데이터 가져오기 실패 (비로그인)', err);
      },
    });
  };

  // Zustand subscribe를 사용하여 로그인 상태 변경 감지
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      const currentIsLoggedIn = state.isLoggedIn;
      if (currentIsLoggedIn === null) return;

      // 이미 API가 호출되었는지 확인
      const hasApiBeenCalled = firstUser !== null || twoUser !== null;
      if (hasApiBeenCalled) return;

      if (currentIsLoggedIn) {
        console.log('로그인 유저 매칭 데이터 가져오기');
        getTodayDatingUserMatch();
      } else {
        console.log('비로그인 유저 매칭 데이터 가져오기');
        getPublicTodayDatingUserMatch();
      }
    });

    // 초기 상태에 대한 처리
    const currentIsLoggedIn = useAuthStore.getState().isLoggedIn;
    if (currentIsLoggedIn !== null) {
      if (currentIsLoggedIn) {
        console.log('초기 로그인 유저 매칭 데이터 가져오기');
        getTodayDatingUserMatch();
      } else {
        console.log('초기 비로그인 유저 매칭 데이터 가져오기');
        getPublicTodayDatingUserMatch();
      }
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSelectAll = async () => {
    if (!firstUser || !twoUser || !firstUser.matchId) return;

    try {
      await selectAllMatchUser({
        matchId: firstUser.matchId,
        firstSelectedUserId: firstUser.id.toString(),
        secondSelectedUserId: twoUser.id.toString(),
      });
      console.log('모두 선택 완료');
    } catch (err) {
      console.error('모두 선택 실패:', err);
    }
  };

  return (
    <main className="p-3">
      <h1 className="text-lg font-semibold">매일 오전 10시</h1>
      <small className="text-slate-400">
        당신을 기다리는 인연이 도착합니다.
      </small>

      <HomeFristProfileCardList
        firstUser={firstUser}
        secondUser={twoUser}
        onSelectAll={handleSelectAll}
      />
      <HomeTwoProfileCardList 
      thirdUser={thirdUser} 
      fourUser={fourUser} 
      onSelectAll={handleSelectAll}
      />
    </main>
  );
}
