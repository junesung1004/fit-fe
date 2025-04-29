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
  fetchFilteredUsersFromGet,
  fetchAnonymousUsers,
  saveFilterSettings,
  fetchCurrentFilter,
  FilteredUser,
} from '@/services/memeber';
import { useAuthStore } from '@/store/authStore';

const REGION = [
  '', '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기',
  '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
];

export default function MembersPage() {
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [users, setUsers] = useState<FilteredUser[]>([]);
  const [age, setAge] = useState(20);
  const [likes, setLikes] = useState(0);
  const [region, setRegion] = useState('');
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let data: FilteredUser[] = [];
        if (isLoggedIn) {
          const filter = await fetchCurrentFilter();
          console.log('📦 현재 필터 상태:', filter);
          setAge(filter.minAge);
          setLikes(filter.minLikeCount);
          setRegion(filter.region);
          data = await fetchFilteredUsersFromGet();
        } else {
          data = await fetchAnonymousUsers();
        }
        console.log('👥 받아온 유저 리스트:', data);
        setUsers(data);
      } catch (err) {
        console.error('사용자 목록 로드 실패:', err);
      }
    };
    fetchUsers();
  }, [isLoggedIn]);

  const toggleFilter = () => setIsShowFilter((v) => !v);
  const resetFilter = () => {
    setAge(20);
    setLikes(0);
    setRegion('');
  };

  const applyFilter = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const filterPayload = {
        region,
        minAge: age,
        maxAge: 60,
        minLikeCount: likes,
      };
      console.log('🚀 보내는 필터 데이터:', filterPayload);
      await saveFilterSettings(filterPayload);

      const refreshedUsers = await fetchFilteredUsersFromGet();
      console.log('🔄 필터 적용 후 유저:', refreshedUsers);

      setUsers(refreshedUsers);
      toggleFilter();
    } catch (err) {
      console.error('필터 적용 실패:', err);
    }
  };

  return (
    <div className="relative w-full min-h-full flex flex-col gap-10">
      {isShowFilter && (
        <div className="absolute z-10 w-full h-full bg-[rgba(0,0,0,0.7)] px-8 py-10">
          <div className="bg-white rounded-3xl p-6 flex flex-col gap-6">
            <div className="flex items-center">
              <h1 className="mx-auto text-lg font-semibold">필터</h1>
              <XMarkIcon
                width={24}
                height={24}
                className="absolute right-14 cursor-pointer"
                onClick={toggleFilter}
              />
            </div>
            <Divider />

            <form className="flex flex-col gap-7" onSubmit={applyFilter}>
              <div className="flex flex-col">
                <label htmlFor="region" className="font-medium mb-1">
                  지역
                </label>
                <select
                  id="region"
                  className="border px-4 py-2 rounded-md"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  {REGION.map((r) => (
                    <option key={r} value={r} disabled={!r}>
                      {r || '지역 선택'}
                    </option>
                  ))}
                </select>
              </div>

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

      <div className="w-full py-10 px-8 flex flex-col">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold">접속 중인 이성</h1>
          <AdjustmentsHorizontalIcon
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={toggleFilter}
          />
        </div>
        <p className="text-gray-400 text-sm">새로운 인연을 찾아 보세요!</p>

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
