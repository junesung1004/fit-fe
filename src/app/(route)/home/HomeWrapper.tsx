'use client';

import HomeFristProfileCardList from '@/components/page/home/HomeFirstProfileCardList';
import HomeTwoProfileCardList from '@/components/page/home/HomeSecondProfileCardList';
import {
  usePublicTodayDatingMatchMutation,
} from '@/hooks/mutation/useTodayDatingMatchMutation';
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

  const { mutate: publicTodayDatingUser } = usePublicTodayDatingMatchMutation();

  useEffect(() => {
    publicTodayDatingUser(undefined, {
      onSuccess: (data: { matches: MatchItem[] }) => {
        const matches = data.matches;
        if (matches.length > 0) {
          const { matchId, user1, user2 } = matches[0];
          setFirstUser({ ...user1, matchId });
          setTwoUser({  ...user2, matchId });
        }
        if (matches.length > 1) {
          const { matchId, user1, user2 } = matches[1];
          setThirdUser({ ...user1, matchId });
          setFourUser({  ...user2, matchId });
        }
      },
      onError: err => {
        console.error('❌ 매칭 데이터 가져오기 실패', err);
      }
    });
  }, []);

  return (
    <main className="p-3">
      <h1 className="text-lg font-semibold">매일 오전 10시</h1>
      <small className="text-slate-400">
        당신을 기다리는 인연이 도착합니다.
      </small>

      <HomeFristProfileCardList
        firstUser={firstUser}
        secondUser={twoUser}
      />
      <HomeTwoProfileCardList
        thirdUser={thirdUser}
        fourUser={fourUser}
      />
    </main>
  );
}
