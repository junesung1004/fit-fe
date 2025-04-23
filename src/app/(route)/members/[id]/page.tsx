'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/solid';
import TagBadge from '@/components/common/TagBadge';
import MemberProfileDetailCard from '@/components/common/ProfileDetailCard';
import { sendNotification } from '@/services/notification';
import { likeMember } from '@/services/like';

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
  const params = useParams();
  const receiverId = params.id as string;  // URL에서 받은 UUID!

  const [isLiked, setIsLiked] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleLikeToggle = async () => {
    if (!receiverId) return alert('상대방 ID가 없습니다!');

    try {
      if (!isLiked) {
        await likeMember(receiverId);

        const notificationPayload = {
          receiverId,
          type: 'LIKE',
          title: '좋아요 알림',
          content: '회원님을 마음에 들어하는 사람이 있어요 💕',
        };

        await sendNotification(notificationPayload);
        alert('좋아요 알림이 전송되었습니다!');
      }

      setIsLiked((prev) => !prev);
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
    } catch (error) {
      console.error('좋아요 알림 전송 실패:', error);
      alert('알림 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDatingChatRequest = async () => {
    if (!receiverId) return alert('상대방 ID가 없습니다!');

    try {
      const notificationPayload = {
        receiverId,
        type: 'COFFEE_CHAT',
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
            style={{ color: isLiked ? '#f87171' : '#d1d5db' }}
            onClick={handleLikeToggle}
            animate={
              isClicked
                ? { scale: [1, 1.4, 1], color: ['#f43f5e', '#be123c', '#f43f5e'] }
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
          onClick={handleDatingChatRequest}
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
