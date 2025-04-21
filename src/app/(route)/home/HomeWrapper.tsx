'use client';

import HomeFristProfileCardList from '@/components/page/home/HomeFirstProfileCardList';
import HomeTwoProfileCardList from '@/components/page/home/HomeSecondProfileCardList';
import React, { useEffect, useState } from 'react';

export interface UserDataType {
  id: number;
  nickname: string;
  age: number;
  region: string;
  height: number;
  mbti: string;
  image: string;
}

const DUMMYDATA: UserDataType[] = [
  {
    id: 1,
    nickname: '박준성',
    age: 20,
    region: '인천',
    height: 176,
    mbti: 'INFP',
    image: '/june.jpg',
  },
  {
    id: 2,
    nickname: '차은우',
    age: 22,
    region: '서울',
    height: 182,
    mbti: 'ISTJ',
    image: '/cha.jpg',
  },

  {
    id: 3,
    nickname: '서현진',
    age: 20,
    region: '인천',
    height: 176,
    mbti: 'INFP',
    image: '/seo.jpg',
  },
  {
    id: 4,
    nickname: '카리나',
    age: 22,
    region: '서울',
    height: 182,
    mbti: 'ISTJ',
    image: '/ka.jpg',
  },
];

export default function HomeWrapper() {
  const [firstUser, setFirstUser] = useState<UserDataType | null>(null);
  const [twoUser, setTwoUser] = useState<UserDataType | null>(null);
  const [thirdUser, setThirdUser] = useState<UserDataType | null>(null);
  const [fourUser, setFourUser] = useState<UserDataType | null>(null);

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
