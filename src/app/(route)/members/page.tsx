'use client';

import {
  useState,
  FormEvent,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import Link from 'next/link';
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import Button from '@/components/common/Button';
import Divider from '@/components/common/Divider';
import RangeSlider from '@/components/page/members/RangeSlider';
import ProfileCard from '@/components/common/Profilecard';
import Spinner from '@/components/common/Spinner';
import { useUsersQuery } from '@/hooks/queries/useUsersQuery';
import { useFilterUsersMutation } from '@/hooks/mutations/useFilterUsersMutation';
import { isAxiosError } from '@/lib/error';
import { toast } from 'react-toastify';
import { FilteredUser } from '@/types/member.type';
import { useUserStatusStore } from '@/store/userStatusStore';

const REGION = [
  '',
  '서울',
  '부산',
  '대구',
  '인천',
  '광주',
  '대전',
  '울산',
  '세종',
  '경기',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주',
];

export default function MembersPage() {
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [minAge, setMinAge] = useState(20);
  const [maxAge, setMaxAge] = useState(60);
  const [minLikes, setMinLikes] = useState(0);
  const [maxLikes, setMaxLikes] = useState(100);
  const [region, setRegion] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<FilteredUser[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const { userStatuses, fetchUserStatuses } = useUserStatusStore();

  const {
    data,
    error: usersError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchUsers,
  } = useUsersQuery({
    take: 6,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLAnchorElement) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isFiltered) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [fetchNextPage, isFiltered]
  );

  const { mutate: filterUsers } = useFilterUsersMutation();

  const users =
    data?.pages
      .flatMap((page) => page.users)
      .reduce<Map<string, FilteredUser>>((acc, user) => {
        if (!acc.has(user.id)) {
          acc.set(user.id, user);
        }
        return acc;
      }, new Map())
      .values() ?? [];

  const uniqueUsers = isFiltered ? filteredUsers : Array.from(users);

  const userIds = useMemo(() => {
    return uniqueUsers.map((user) => user.id);
  }, [uniqueUsers]);

  useEffect(() => {
    if (userIds.length > 0) {
      fetchUserStatuses(userIds);
    }
  }, [userIds, fetchUserStatuses]);

  useEffect(() => {
    if (usersError) {
      if (isAxiosError(usersError)) {
        toast.error(
          usersError.response?.data.message ||
            '사용자 목록을 불러오는데 실패했습니다.'
        );
      } else {
        toast.error('사용자 목록을 불러오는데 실패했습니다.');
      }
    }
  }, [usersError]);

  const handleApplyFilter = (e: FormEvent) => {
    e.preventDefault();
    const filter = {
      region,
      ageMin: minAge,
      ageMax: maxAge,
      minLikes,
      maxLikes,
      page: 1,
      limit: 6,
    };
    setIsFiltered(true);
    filterUsers(filter, {
      onSuccess: (data) => {
        setFilteredUsers(data);
        toast.success('필터가 적용되었습니다.');
        toggleFilter();
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          toast.error(
            error.response?.data.message || '필터 적용에 실패했습니다.'
          );
        } else {
          toast.error('필터 적용에 실패했습니다.');
        }
      },
    });
  };

  const toggleFilter = () => setIsShowFilter((v) => !v);
  const resetFilter = () => {
    setMinAge(20);
    setMaxAge(60);
    setMinLikes(0);
    setMaxLikes(100);
    setRegion('');
    setFilteredUsers([]);
    setIsFiltered(false);
    refetchUsers();
  };

  return (
    <div
      className={`relative w-full h-[calc(100vh-160px)] flex flex-col ${isShowFilter ? 'overflow-hidden' : ''}`}
    >
      {isShowFilter && (
        <div className="absolute inset-0 z-10 bg-zinc-900/80 px-8 py-10 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-6 flex flex-col gap-6 w-full max-w-md">
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
            <form className="flex flex-col gap-7" onSubmit={handleApplyFilter}>
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
                minValue={minAge}
                maxValue={maxAge}
                unit="세"
                rangeText="20세 ~ 60세"
                onInput={(min, max) => {
                  setMinAge(min);
                  setMaxAge(max);
                }}
              />
              <RangeSlider
                id="likes"
                name="likes"
                label="좋아요 수"
                min={0}
                max={100}
                step={1}
                minValue={minLikes}
                maxValue={maxLikes}
                unit="개"
                rangeText="0개 ~ 100개"
                onInput={(min, max) => {
                  setMinLikes(min);
                  setMaxLikes(max);
                }}
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

        <div className="flex flex-wrap gap-7 pt-5">
          {uniqueUsers.map((u, index) => (
            <Link
              key={u.id}
              href={`/members/${u.id}`}
              ref={
                index === uniqueUsers.length - 1 && hasNextPage
                  ? lastElementRef
                  : undefined
              }
            >
              <ProfileCard
                userId={u.id}
                name={u.nickname}
                age={u.age}
                likes={u.likeCount}
                region={u.region}
                isOnline={userStatuses[u.id] || false}
                profileImageUrl={u.profileImage ?? '/default.png'}
              />
            </Link>
          ))}
        </div>
        {isFetchingNextPage && (
          <div className="text-center py-4">
            <Spinner size="sm" color="primary" />
          </div>
        )}
      </div>
    </div>
  );
}
