'use client';

import HomeFristProfileCardList from '@/components/page/home/HomeFirstProfileCardList';
import HomeTwoProfileCardList from '@/components/page/home/HomeSecondProfileCardList';
import { DUMMYDATA } from '@/constants/homeDummyData';
import {
  usePublicTodayDatingMatchMutation,
  useTodayDatingMatchMutation,
} from '@/hooks/mutation/useTodayDatingMatchMutation';
import { UserDataType } from '@/types/homePage.type';
import React, { useEffect, useState } from 'react';

export default function HomeWrapper() {
  const [firstUser, setFirstUser] = useState<UserDataType | null>(null);
  const [twoUser, setTwoUser] = useState<UserDataType | null>(null);
  const [thirdUser, setThirdUser] = useState<UserDataType | null>(null);
  const [fourUser, setFourUser] = useState<UserDataType | null>(null);
  const { mutate: todayDatingUser } = useTodayDatingMatchMutation();
  const { mutate: publicTodayDatingUser } = usePublicTodayDatingMatchMutation();
  const [data, setData] = useState([]);
  console.log('data :', data);
  const [publicData, setPublicData] = useState([]);
  console.log('publicData :', publicData);

  const getTodayDatingUserMatch = async () => {
    todayDatingUser(undefined, {
      onSuccess: (data) => {
        // 여기서 data 배열을 설정
        setData(data);
      },
      onError: (err) => {
        console.error('❌ 매칭 데이터 가져오기 실패', err);
      },
    });
  };

  const getPublicTodayDatingUserMatch = async () => {
    publicTodayDatingUser(undefined, {
      onSuccess: (data) => {
        // 여기서 data 배열을 설정
        setPublicData(data);
      },
      onError: (err) => {
        console.error('❌ 매칭 데이터 가져오기 실패', err);
      },
    });
  };

  useEffect(() => {
    getTodayDatingUserMatch();
    getPublicTodayDatingUserMatch();
    // setFirstUser(res[0]);
    // setTwoUser(res[1]);
    // setThirdUser(res[2]);
    // setFourUser(res[3]);
  }, []);

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
