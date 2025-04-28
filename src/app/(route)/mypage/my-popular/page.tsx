'use client';

import TagBadge from '@/components/common/TagBadge';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/solid';
import MemberProfileDetailCard from '@/components/common/ProfileDetailCard';
import { getMyProfile } from '@/services/user';

interface UserProfile {
  id: string;
  nickname: string;
  profileImage: string;
  job: string;
  height: number;
  birthday: string;
  likeCount: number;
  mbti: string;
  interestCategory: string[];
  userIntroductions: string[];
  userFeedbacks: string[];
}

export default function MyPopularPage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getMyProfile();
      if (data) setUser(data);
    };
    fetchUser();
  }, []);

  if (!user) return <div className="text-center mt-20">로딩 중...</div>;

  const koreanAge =
    new Date().getFullYear() - new Date(user.birthday).getFullYear() + 1;

  return (
    <div className="w-full min-h-full flex flex-col gap-10 px-2 xs:px-20 py-5">
      {/* 멤버 디테일 컴포넌트 */}
      <MemberProfileDetailCard>
        {/* 이미지 */}
        <MemberProfileDetailCard.Image>
          <Image
            src={user.profileImage || '/default.png'}
            alt="프로필 이미지"
            fill
            className="rounded-xl object-cover"
          />
        </MemberProfileDetailCard.Image>

        {/* information */}
        <MemberProfileDetailCard.Information>
          <p>직업 : {user.job}</p>
          <p>키 : {user.height ?? '-'}cm</p>
          <p>나이 : {koreanAge}세</p>
          <p>MBTI : {user.mbti}</p>
          <p>관심사 : {user.interestCategory.join(', ')}</p>
        </MemberProfileDetailCard.Information>

        {/* LikeCountBadge */}
        <MemberProfileDetailCard.LikeCountBadge>
          <motion.div
            style={{ color: '#f87171' }}
            transition={{ duration: 0.4 }}
          >
            <HeartIcon className="w-10 h-10" />
          </motion.div>

          <motion.div
            key={user.likeCount}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {user.likeCount}
          </motion.div>
        </MemberProfileDetailCard.LikeCountBadge>
      </MemberProfileDetailCard>

      {/* AboutMe */}
      <MemberProfileDetailCard.AboutMe>
        <div className="flex flex-col">
          {/* 이런 얘기 많이 들어요 */}
          <h1 className="text-violet-500 mb-3">이런 얘기 많이 들어요</h1>
          <div className="flex flex-wrap gap-3 mb-10">
            {user.userFeedbacks.map((fb, idx) => (
              <TagBadge key={idx}>{fb}</TagBadge>
            ))}
          </div>

          {/* 저는 이런 사람이에요 */}
          <h1 className="text-violet-500 mb-3">저는 이런 사람이에요</h1>
          <div className="flex flex-wrap gap-3">
            {user.userIntroductions.map((intro, idx) => (
              <TagBadge key={idx}>{intro}</TagBadge>
            ))}
          </div>
        </div>
      </MemberProfileDetailCard.AboutMe>
    </div>
  );
}
