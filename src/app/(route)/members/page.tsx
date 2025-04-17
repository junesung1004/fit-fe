'use client';

import Button from '@/components/common/Button';
import Divider from '@/components/common/Divider';
import RangeSlider from '@/components/page/members/RangeSlider';
import React, { FormEvent, useState } from 'react';
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import ProfileCard from '@/components/common/Profilecard';
import Link from 'next/link';

const dummyProfile = [
  {
    id: 1,
    name: '박준성',
    likes: 2,
    age: 20,
    region: '인천',
    isOnline: true,
    profileImageUrl: '/june.jpg',
  },
  {
    id: 2,
    name: '서현진',
    likes: 30,
    age: 20,
    region: '서울',
    isOnline: true,
    profileImageUrl: '/seo.jpg',
  },
  {
    id: 3,
    name: '귀요미',
    likes: 26,
    age: 3,
    region: '인천',
    isOnline: true,
    profileImageUrl: '/강아지프로필.jpg',
  },
  {
    id: 4,
    name: '여돌이',
    likes: 15,
    age: 4,
    region: '인천',
    isOnline: true,
    profileImageUrl: '/여돌이.jpg',
  },
  {
    id: 5,
    name: '차은우',
    likes: 29,
    age: 20,
    region: '서울',
    isOnline: true,
    profileImageUrl: '/cha.jpg',
  },
  {
    id: 6,
    name: '카리나',
    likes: 21,
    age: 20,
    region: '경기',
    isOnline: true,
    profileImageUrl: '/ka.jpg',
  },
];

export default function MembersPage() {
  const [distance, setDistance] = useState<number>(0);
  const [age, setAge] = useState<number>(20);
  const [likes, setLikes] = useState<number>(0);
  const [isShowFilter, setIsShowFilter] = useState(false);

  const handleCilckResetFilter = () => {
    setDistance(0);
    setAge(20);
    setLikes(0);
  };

  const haldleFilterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('거리 :', distance);
    console.log('나이 :', age);
    console.log('좋아요 :', likes);
  };

  const handleClickShowFilter = () => {
    setIsShowFilter((prev) => !prev);
  };

  const handleClickCloseFilter = () => {
    setIsShowFilter((prev) => !prev);
  };

  return (
    <div className="relative w-full min-h-full flex flex-col gap-10">
      {/* 필터링 컨테이너 */}
      {isShowFilter && (
        <div className="absolute z-10 w-full h-full bg-[rgba(0,0,0,0.7)] px-8 py-10">
          <div className="bg-white w-full h-auto rounded-3xl flex flex-col  py-10 px-5">
            <div className="flex">
              <h1 className="mx-auto text-lg font-semibold">필터</h1>
              <XMarkIcon
                width={24}
                height={24}
                onClick={handleClickCloseFilter}
                className="absolute cursor-pointer right-16"
              />
            </div>

            <Divider />

            {/* 필터링 컨테이너 */}
            <div className="py-3">
              <form
                className="flex flex-col gap-7"
                onSubmit={haldleFilterSubmit}
              >
                {/* 거리 필터링 */}
                <RangeSlider
                  id="distance"
                  name="distance"
                  label="거리"
                  min={0}
                  max={10}
                  step={1}
                  value={distance}
                  unit="km"
                  rangeText="0km ~ 10km"
                  onChange={setDistance}
                />

                {/* 나이 필터링 */}
                <RangeSlider
                  id="age"
                  name="age"
                  label="나이"
                  min={20}
                  max={60}
                  step={5}
                  value={age}
                  unit="세"
                  rangeText="20세 ~ 60세"
                  onChange={setAge}
                />

                {/* 좋아요 수 필터링 */}
                <RangeSlider
                  id="likes"
                  name="likes"
                  label="좋아요 수"
                  min={0}
                  max={30}
                  step={1}
                  value={likes}
                  unit="개"
                  rangeText="0개 ~ 30개"
                  onChange={setLikes}
                />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="full"
                    rounded="md"
                    type="submit"
                    onClick={handleCilckResetFilter}
                  >
                    초기화
                  </Button>
                  <Button size="full" rounded="md" type="submit">
                    적용
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* 회원 프로필 컨테이너 */}
      <div className="w-full py-10 px-8 flex flex-col">
        <div className="flex justify-between">
          <h1 className="font-semibold">접속 중인 이성</h1>
          <AdjustmentsHorizontalIcon
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={handleClickShowFilter}
          />
        </div>
        <p className="text-gray-400 text-sm">새로운 인연을 찾아 보세요</p>

        {/* 회원 프로필 리스트 */}
        <div className="flex flex-wrap justify-center items-center pt-5 gap-7">
          {dummyProfile.map((el) => (
            <Link key={el.id} href={`/members/${el.id}`}>
              <ProfileCard
                name={el.name}
                age={el.age}
                likes={el.likes}
                region={el.region}
                isOnline={true}
                profileImageUrl={el.profileImageUrl}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
