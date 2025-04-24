'use client';

import HomeFristProfileCardList from '@/components/page/home/HomeFirstProfileCardList';
import HomeTwoProfileCardList from '@/components/page/home/HomeSecondProfileCardList';
// import { DUMMYDATA } from '@/constants/homeDummyData';
import {
  usePublicTodayDatingMatchMutation,
  useTodayDatingMatchMutation,
  // useTodayDatingMatchMutation,
} from '@/hooks/mutation/useTodayDatingMatchMutation';
import { useAuthStore } from '@/store/authStore';
import { UserDataType } from '@/types/homePage.type';
import React, { useEffect, useState } from 'react';

export default function HomeWrapper() {
  const [firstUser, setFirstUser] = useState<UserDataType | null>(null);
  const [twoUser, setTwoUser] = useState<UserDataType | null>(null);
  //console.log('firstUser :', firstUser);
  const [thirdUser, setThirdUser] = useState<UserDataType | null>(null);
  const [fourUser, setFourUser] = useState<UserDataType | null>(null);
  const { mutate: todayDatingUser } = useTodayDatingMatchMutation();
  const { mutate: publicTodayDatingUser } = usePublicTodayDatingMatchMutation();
  const [data, setData] = useState([]);
  console.log('data :', data);
  const { isLoggedIn } = useAuthStore();
  const [publicData, setPublicData] = useState<{
    matches: { user1: UserDataType; user2: UserDataType }[];
  }>({
    matches: [],
  });

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
    if (isLoggedIn) {
      getTodayDatingUserMatch(); // 🔐 로그인 유저용 API
    } else {
      getPublicTodayDatingUserMatch(); // 🌐 비로그인 유저용 API
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (publicData?.matches?.length > 0) {
      setFirstUser(publicData.matches[0].user1);
      setTwoUser(publicData.matches[0].user2);
    }
    if (publicData?.matches?.length > 0) {
      setThirdUser(publicData.matches[1].user1);
      setFourUser(publicData.matches[1].user2);
    }
  }, [publicData]);

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
