'use client';

import HomeFirstProfileCardList from '@/components/page/home/HomeFirstProfileCardList';
import HomeTwoProfileCardList from '@/components/page/home/HomeSecondProfileCardList';
import {
  usePublicTodayDatingMatchMutation,
  useTodayDatingMatchMutation,
} from '@/hooks/mutations/useTodayDatingMatchMutation';
import { selectAllMatchUser } from '@/services/todayDatingMatch';
import { useAuthStore } from '@/store/authStore';
import { UserDataType } from '@/types/homePage.type';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/common/Spinner';

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
  const [firstSelected, setFirstSelected] = useState(false);
  const [secondSelected, setSecondSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { mutate: todayDatingUser } = useTodayDatingMatchMutation();
  const { mutate: publicTodayDatingUser } = usePublicTodayDatingMatchMutation();
  const {} = useAuthStore();

  const isAllSelected = firstSelected && secondSelected;
  const isNoMatchUser = !firstUser && !twoUser && !thirdUser && !fourUser;

  const getPublicTodayDatingUserMatch = () => {
    setIsLoading(true);
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
        setIsLoading(false);
      },
      onError: (err) => {
        console.error('❌ 매칭 데이터 가져오기 실패 (비로그인)', err);
        setIsLoading(false);
      },
    });
  };

  const getTodayDatingUserMatch = () => {
    setIsLoading(true);
    todayDatingUser(undefined, {
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
        setIsLoading(false);
      },
      onError: (err) => {
        console.error('❌ 매칭 데이터 가져오기 실패 (로그인)', err);
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      const currentIsLoggedIn = state.isLoggedIn;
      if (currentIsLoggedIn === null) return;

      const hasApiBeenCalled = firstUser !== null || twoUser !== null;
      if (hasApiBeenCalled) return;

      if (currentIsLoggedIn) {
        getTodayDatingUserMatch();
      } else {
        getPublicTodayDatingUserMatch();
      }
    });

    const currentIsLoggedIn = useAuthStore.getState().isLoggedIn;
    if (currentIsLoggedIn !== null) {
      if (currentIsLoggedIn) {
        getTodayDatingUserMatch();
      } else {
        getPublicTodayDatingUserMatch();
      }
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSelectAllFirst = async () => {
    if (!firstUser || !twoUser || !firstUser.matchId) return;
    try {
      await selectAllMatchUser({
        matchId: firstUser.matchId,
        firstSelectedUserId: firstUser.id.toString(),
        secondSelectedUserId: twoUser.id.toString(),
      });
      setFirstSelected(true);
    } catch (err) {
      console.error('첫 번째 매칭 모두 선택 실패:', err);
    }
  };

  const handleSelectAllSecond = () => {
    setSecondSelected(true);
  };

  return (
    <main className="p-3">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
          <Spinner size="lg" color="primary" />
          <p className="text-gray-500 mt-4">매칭 데이터를 불러오는 중...</p>
        </div>
      ) : (
        <>
          <h1 className="text-lg font-semibold">매일 오전 10시</h1>
          <small className="text-slate-400">
            당신을 기다리는 인연이 도착합니다.
          </small>

          {isNoMatchUser ? (
            <div className="flex flex-col items-center justify-center mt-10">
              <p className="text-2xl font-bold text-violet-600">
                오늘 매칭할 사람이 없습니다.
              </p>
              <p className="text-gray-500 mt-2">
                내일 오전 10시에 새로운 인연을 만나보세요 ☀️
              </p>
            </div>
          ) : (
            <>
              {isAllSelected && (
                <div className="flex flex-col items-center justify-center mt-5 mb-5">
                  <p className="text-violet-500 font-semibold text-lg">
                    오늘의 인연을 모두 선택하셨습니다 🎉
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-6">
                {firstUser && twoUser && (
                  <HomeFirstProfileCardList
                    firstUser={firstUser}
                    secondUser={twoUser}
                    onSelectAll={handleSelectAllFirst}
                  />
                )}
                {thirdUser && fourUser && (
                  <HomeTwoProfileCardList
                    thirdUser={thirdUser}
                    fourUser={fourUser}
                    onSelectAll={handleSelectAllSecond}
                  />
                )}
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
