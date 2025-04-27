'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import Button from '@/components/common/Button';
import Divider from '@/components/common/Divider';
import RangeSlider from '@/components/page/members/RangeSlider';
import ProfileCard from '@/components/common/Profilecard';
import {
  fetchFilteredUsersInitial,
  applyUserFilter,
  fetchFilteredUsersAfterFilter,
  fetchAnonymousUsers,
  FilteredUser
} from '@/services/memeber';
import { useAuthStore } from '@/store/authStore';

export default function MembersPage() {
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [users, setUsers] = useState<FilteredUser[]>([]);
  const [distance, setDistance] = useState(0); // 사용 안함
  const [age, setAge] = useState(20);
  const [likes, setLikes] = useState(0);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 🔥 초기 데이터 불러오기 (로그인 / 비로그인)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let data: FilteredUser[] = [];
        if (isLoggedIn) {
          // 로그인 → 첫 조회
          data = await fetchFilteredUsersInitial();
        } else {
          // 비로그인
          data = await fetchAnonymousUsers();
        }
        setUsers(data);
      } catch (err) {
        console.error('사용자 목록 로드 실패:', err);
      }
    };
    fetchUsers();
  }, [isLoggedIn]);

  // 필터 모달 열기/닫기
  const toggleFilter = () => setIsShowFilter((v) => !v);

  // 필터 초기화
  const resetFilter = () => {
    setDistance(0);
    setAge(20);
    setLikes(0);
  };

  // 필터 적용
  const applyFilter = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // 로그인 유저만 필터 적용 가능
      if (isLoggedIn) {
        await applyUserFilter({ minAge: age, maxAge: 60, minLikeCount: likes });
        const filteredUsers = await fetchFilteredUsersAfterFilter();
        setUsers(filteredUsers);
        toggleFilter(); // 필터 닫기
      }
    } catch (err) {
      console.error('필터 적용 실패:', err);
    }
  };

  return (
    <div className="relative w-full min-h-full flex flex-col gap-10">
      {/* 필터 모달 */}
      {isShowFilter && isLoggedIn && (
        <div className="absolute z-10 w-full h-full bg-[rgba(0,0,0,0.7)] px-8 py-10">
          <div className="bg-white rounded-3xl p-6 flex flex-col gap-6">
            <div className="flex items-center">
              <h1 className="mx-auto text-lg font-semibold">필터</h1>
              <XMarkIcon
                width={24}
                height={24}
                className="absolute right-6 cursor-pointer"
                onClick={toggleFilter}
              />
            </div>
            <Divider />

            <form className="flex flex-col gap-7" onSubmit={applyFilter}>
              {/* 거리 필터 (사용 안함) */}
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
              <RangeSlider
                id="age"
                name="age"
                label="나이"
                min={20}
                max={60}
                step={1}
                value={age}
                unit="세"
                rangeText="20세 ~ 60세"
                onChange={setAge}
              />
              <RangeSlider
                id="likes"
                name="likes"
                label="좋아요 수"
                min={0}
                max={100}
                step={1}
                value={likes}
                unit="개"
                rangeText="0개 ~ 100개"
                onChange={setLikes}
              />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="full"
                  rounded="md"
                  type="button"
                  onClick={resetFilter}
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
      )}

      {/* 사용자 리스트 */}
      <div className="w-full py-10 px-8 flex flex-col">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold">접속 중인 이성</h1>
          {isLoggedIn && (
            <AdjustmentsHorizontalIcon
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={toggleFilter}
            />
          )}
        </div>
        <p className="text-gray-400 text-sm">새로운 인연을 찾아 보세요</p>

        <div className="flex flex-wrap justify-center items-center pt-5 gap-7">
          {users.map((u) => (
            <Link key={u.id} href={`/members/${u.id}`}>
              <ProfileCard
                name={u.nickname}
                age={u.age}
                likes={u.likeCount}
                region={u.region}
                isOnline={true}
                profileImageUrl={u.profileImage ?? '/default.png'}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
