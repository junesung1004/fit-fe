'use client';

import HomeFristProfileCardList from '@/components/page/home/HomeFirstProfileCardList';
import HomeTwoProfileCardList from '@/components/page/home/HomeSecondProfileCardList';
import { DUMMYDATA } from '@/constants/homeDummyData';
import { UserDataType } from '@/types/homePage.type';
// import { useTodayDatingMatchMutation } from '@/hooks/mutation/useTodayDatingMatchMutation';

import React, { useEffect, useState } from 'react';

export default function HomeWrapper() {
  const [firstUser, setFirstUser] = useState<UserDataType | null>(null);
  const [twoUser, setTwoUser] = useState<UserDataType | null>(null);
  const [thirdUser, setThirdUser] = useState<UserDataType | null>(null);
  const [fourUser, setFourUser] = useState<UserDataType | null>(null);
  // const { mutate: todayDatingUser } = useTodayDatingMatchMutation();

  // const getTodayDatingUserMatch = async () => {
  //   todayDatingUser()
  // };

  // useEffect(()=> {
  //   const res = getTodayDatingUserMatch()
  //   setFirstUser(res[0]);
  //   setTwoUser(res[1]);
  //   setThirdUser(res[2]);
  //   setFourUser(res[3]);
  // },[])

  useEffect(() => {
    setFirstUser(DUMMYDATA[0]);
    setTwoUser(DUMMYDATA[1]);
    setThirdUser(DUMMYDATA[2]);
    setFourUser(DUMMYDATA[3]);
  }, []);

  return (
    <main className="p-3">
      <h1 className="text-lg font-semibold">매일 오전 10시</h1>
      <small className="text-slate-400">
        당신을 기다리는 인연이 도착합니다.
      </small>

      {/* 메인 홈 프로필 카드 영역 */}
      <HomeFristProfileCardList firstUser={firstUser} secondUser={twoUser} />
      <HomeTwoProfileCardList thirdUser={thirdUser} fourUser={fourUser} />
    </main>
  );
}
