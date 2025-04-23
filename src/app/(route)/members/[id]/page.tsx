'use client';

import TagBadge from '@/components/common/TagBadge';
import Image from 'next/image';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/solid';
import MemberProfileDetailCard from '@/components/common/ProfileDetailCard';
import { sendNotification } from '@/services/notification';  // NotificationService import

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
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태
  const [isClicked, setIsClicked] = useState(false);

  const senderId = 123; // 로그인된 사용자 ID 예시

  const handleLikeToggle = async (senderId: number, receiverId: number) => {
    try {
      if (!isLiked) {
        // 좋아요 알림 전송
        const notificationPayload = {
          senderId,
          receiverId,
          type: 'like',
          title: '좋아요 알림',
          content: '회원님을 마음에 들어하는 사람이 있어요 💕',
        };
        await sendNotification(notificationPayload);
        alert('좋아요 알림이 전송되었습니다!');
      }

      // 상태 토글 및 애니메이션
      setIsLiked((prev) => !prev);
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
    } catch (error) {
      console.error('좋아요 알림 전송 실패:', error);
      alert('알림 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDatingChatRequest = async (senderId: number, receiverId: number) => {
    try {
      const notificationPayload = {
        senderId,
        receiverId,
        type: 'chat_request',
        title: '커피챗 신청',
        content: '커피챗 요청이 도착했어요 ☕',
      };
      await sendNotification(notificationPayload);
      alert('커피챗 신청 알림이 전송되었습니다!');
    } catch (error) {
      console.error('커피챗 신청 알림 전송 실패:', error);
      alert('알림 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col gap-10 px-2 xs:px-20 py-5">
      <MemberProfileDetailCard>
        <MemberProfileDetailCard.Image>
          <Image
            src={'/june.jpg'}
            alt="프로필 이미지"
            fill
            className="rounded-xl object-cover"
          />
        </MemberProfileDetailCard.Image>

        <MemberProfileDetailCard.Information>
          <p className="flex items-center gap-2">직업 : 개발자</p>
          <p>키 : 176cm</p>
          <p>나이 : 34세</p>
          <p>MBTI : INFP</p>
          <p>관심사 : 운동, 여행, 술 </p>
        </MemberProfileDetailCard.Information>

        <MemberProfileDetailCard.LikeCountBadge>
          <motion.div
            style={{ color: isLiked ? '#f87171' : '#d1d5db' }} // 빨간색 or 회색
            onClick={() => {
              handleLikeToggle(senderId, 1);
            }}
            animate={
              isClicked
                ? {
                    scale: [1, 1.4, 1],
                    color: ['#f43f5e', '#be123c', '#f43f5e'],
                  }
                : {}
            }
            transition={{ duration: 0.4 }}
            className="cursor-pointer"
          >
            <HeartIcon className="w-10 h-10" />
          </motion.div>

          <motion.div
            key={isLiked ? 1 : 0}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {isLiked ? 1 : 0}
          </motion.div>
        </MemberProfileDetailCard.LikeCountBadge>
      </MemberProfileDetailCard>

      <MemberProfileDetailCard.AboutMe>
        <button
          onClick={() => handleDatingChatRequest(senderId, 1)}
          className="text-white bg-cyan-500 py-5 rounded-2xl hover:bg-cyan-300 active:bg-cyan-400"
        >
          ☕ 커피챗을 신청해보세요.
        </button>

        <div className="flex flex-col">
          <h1 className="text-violet-500 mb-3">이런 얘기 많이 들어요</h1>
          <div className="flex flex-wrap gap-3 mb-10">
            {dummyData.map((el) => (
              <TagBadge key={el.id}>{el.text}</TagBadge>
            ))}
          </div>

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
