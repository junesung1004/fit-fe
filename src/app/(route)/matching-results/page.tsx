'use client';

import Button from '@/components/common/Button';
import ProfileCard from '@/components/common/Profilecard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import logofit from '@/assets/1.png';
import Image from 'next/image';

const dummyProfile = [
  {
    matched: true,
    members: [
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
    ],
  },
  {
    matched: false,
    members: [
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
    ],
  },
  {
    matched: true,
    members: [
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
    ],
  },
];

export default function MatchingResultsPage() {
  const [isSuccess, setIsSucceess] = useState(false);
  const [isFalse, setIsFalse] = useState(false);
  const router = useRouter();

  const handleClickChattingMove = () => {
    router.push('/chats/1');
  };

  const handleClickMembersMove = () => {
    router.push('/members');
  };

  const handleClickMatchedResult = (matched: boolean) => {
    if (matched) {
      setIsSucceess(true);
    } else {
      setIsFalse(true);
    }
  };

  return (
    <div className="relative w-full min-h-full flex flex-col">
      {/* 성공했을 때 팝업 */}
      {isSuccess && (
        <div className="absolute z-10 w-full h-full bg-[rgba(0,0,0,0.7)] px-2 xs:px-8 py-10">
          <div className="bg-white w-full h-auto rounded-3xl flex flex-col mt-40  py-10 px-5">
            <h1 className="text-xs xs:text-xl text-center mb-5">
              {'“매칭 성공! 🎊 새로운 인연이 시작됐어요.”'}
            </h1>
            <div className="flex justify-between items-center">
              <div className="text-rose-300 text-xs xs:text-base">
                <p>두 분 모두 서로를 좋아했어요.</p>
                <p>
                  지금 바로 <span className="text-violet-500">커피챗</span>을
                  신청해보세요!
                </p>
              </div>
              <Button
                size="md"
                rounded="md"
                color="violet"
                onClick={handleClickChattingMove}
              >
                ☕️ 대화하러 가기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 실패했을 때 팝업 */}
      {isFalse && (
        <div className="absolute z-10 w-full h-full bg-[rgba(0,0,0,0.7)] px-2 xs:px-8 py-10">
          <div className="bg-white w-full h-auto rounded-3xl flex flex-col mt-40 py-10 px-5 ">
            <h1 className="text-xs xs:text-xl text-center mb-5">
              {'“매칭 실패! 🙊 인연이 아니었습니다.”'}
            </h1>
            <div className="flex justify-between items-center">
              <div className="text-rose-300 text-xs xs:text-base">
                <p>안타깝게도... 매칭에 실패했어요.</p>
                <p>더 매력적인 이성을 찾으러 가볼까요?</p>
              </div>
              <Button
                size="md"
                rounded="md"
                color="violet"
                onClick={handleClickMembersMove}
              >
                👀 회원 둘러보기
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5 justify-center items-center px-5 py-10">
        {dummyProfile.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="flex gap-3 justify-center items-center py-10"
          >
            <Link href={`/members/${group.members[0].id}`}>
              <ProfileCard {...group.members[0]} />
            </Link>

            {/* 결과 버튼 */}
            <div className="flex flex-col gap-5 justify-center items-center">
              <Image src={logofit} alt="로고" width={70} height={100} />
              <Button
                rounded="md"
                size="sm"
                onClick={() => handleClickMatchedResult(group.matched)}
              >
                결과 보기
              </Button>
            </div>

            <Link href={`/members/${group.members[1].id}`}>
              <ProfileCard {...group.members[1]} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
