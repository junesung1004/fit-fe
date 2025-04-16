'use client';

import TagBadge from '@/components/page/members/TagBadge';
import Image from 'next/image';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/solid';
import MemberProfileDetailCard from '@/components/common/ProfileDetailCard';

const dummyData = [
  { id: 1, text: '동안' },
  { id: 2, text: '예쁜 눈 웃음' },
  { id: 3, text: '귀여운 똑단발' },
  { id: 4, text: '비율이 좋아요' },
];

const dummyData1 = [
  { id: 1, text: '웃음이 많아요' },
  { id: 2, text: '얘기를 잘 들어줘요' },
  { id: 3, text: '예의가 발라요' },
  { id: 4, text: '훌륭한 요리 실력' },
];

export default function MemberDetailPage() {
  const [score, setScore] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setScore((prev) => prev + 1);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300); // 애니메이션 끝나고 리셋
  };

  const handleClickDatingChatRequest = () => {
    console.log('클릭');
  };

  return (
    <div className="w-full min-h-full flex flex-col gap-10 px-2 xs:px-20 py-5">
      {/* 멤버 디테일 컴포넌트 */}
      <MemberProfileDetailCard>
        {/* 이미지 */}
        <MemberProfileDetailCard.Image>
          <Image
            src={'/june.jpg'}
            alt="프로필 이미지"
            fill
            className="rounded-xl object-cover"
          />
        </MemberProfileDetailCard.Image>

        {/* information */}
        <MemberProfileDetailCard.Information>
          <p className="flex items-center gap-2">직업 : 개발자</p>
          <p>키 : 176cm</p>
          <p>나이 : 34세</p>
          <p>MBTI : INFP</p>
          <p>관심사 : 운동, 여행, 술 </p>
        </MemberProfileDetailCard.Information>

        {/* LikeCountBadge */}
        <MemberProfileDetailCard.LikeCountBadge>
          {/* 하트 애니메이션 */}
          <motion.div
            style={{ color: '#f87171' }}
            onClick={handleClick}
            animate={
              isClicked
                ? {
                    scale: [1, 1.4, 1],
                    color: ['#f43f5e', '#be123c', '#f43f5e'], // Tailwind rose-500 → rose-700 → rose-500
                  }
                : {}
            }
            transition={{ duration: 0.4 }}
            className="cursor-pointer"
          >
            <HeartIcon className="w-10 h-10" />
          </motion.div>

          {/* 점수 숫자 애니메이션 */}
          <motion.div
            key={score} // key가 변해야 AnimatePresence가 동작함!
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {score}
          </motion.div>
        </MemberProfileDetailCard.LikeCountBadge>
      </MemberProfileDetailCard>

      {/* AboutMe */}
      <MemberProfileDetailCard.AboutMe>
        <button
          onClick={handleClickDatingChatRequest}
          className="text-white bg-cyan-500 py-5 rounded-2xl hover:bg-cyan-300 active:bg-cyan-400"
        >
          ☕ 커피챗을 신청해보세요.
        </button>

        {/* 나에 대한 정보*/}
        <div className="flex flex-col">
          {/* 이런 얘기 많이 들어요 */}
          <h1 className="text-violet-500 mb-3">이런 얘기 많이 들어요</h1>

          <div className="flex flex-wrap gap-3 mb-10">
            {dummyData.map((el) => (
              <TagBadge key={el.id}>{el.text}</TagBadge>
            ))}
          </div>

          {/* 저는 이런 사람이에요 */}
          <h1 className="text-violet-500 mb-3">저는 이런 사람이에요</h1>

          <div className="flex flex-wrap gap-3">
            {dummyData1.map((el) => (
              <TagBadge key={el.id}>{el.text}</TagBadge>
            ))}
          </div>
        </div>
      </MemberProfileDetailCard.AboutMe>
    </div>
  );
}
