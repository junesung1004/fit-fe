'use client';

import { useParams} from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/solid';
import TagBadge from '@/components/common/TagBadge';
import MemberProfileDetailCard from '@/components/common/ProfileDetailCard';
import Button from '@/components/common/Button';
import { sendNotification } from '@/services/notification';
import { likeMember } from '@/services/like';
import { fetchUserInfo, MemberDetailResponse } from '@/services/memberDetail';
import { useAuthStore } from '@/store/authStore';
import LoginRequiredModal from '@/components/common/LoginRequiredModal';

export default function MemberDetailPage() {
 
  const params = useParams();
  const userId = params.id as string;

  const { isLoggedIn } = useAuthStore();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [member, setMember] = useState<MemberDetailResponse | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const data = await fetchUserInfo(userId);
        setMember(data);
      } catch (error) {
        console.error('멤버 정보 로드 실패:', error);
      }
    };
    getUserInfo();
  }, [userId]);

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }

    if (!userId) return alert('상대방 ID가 없습니다!');
    try {
      if (!isLiked) {
        await likeMember(userId);
        await sendNotification({
          receiverId: userId,
          type: 'LIKE',
          title: '좋아요 알림',
          content: '회원님을 마음에 들어하는 사람이 있어요 💕',
        });
        alert('좋아요 알림이 전송되었습니다!');
      }
      setIsLiked((prev) => !prev);
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
    } catch (error) {
      console.error('좋아요 알림 전송 실패:', error);
    }
  };

  const handleDatingChatRequest = async () => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }

    if (!userId) return alert('상대방 ID가 없습니다!');
    try {
      await sendNotification({
        receiverId: userId,
        type: 'COFFEE_CHAT',
        title: '커피챗 신청',
        content: '커피챗 요청이 도착했어요 ☕',
      });
      alert('커피챗 신청 알림이 전송되었습니다!');
    } catch (error) {
      console.error('커피챗 신청 알림 전송 실패:', error);
    }
  };

  if (!member) return <div>로딩 중...</div>;

  const mainImage = member.profileImage ?? '/default.png';
  const koreanAge = member.age;

  return (
    <div className="w-full min-h-full flex flex-col gap-4 px-2 xs:px-20 py-5">
      <MemberProfileDetailCard>
        <MemberProfileDetailCard.Image>
          <Image
            src={mainImage}
            alt="프로필 이미지"
            fill
            className="rounded-xl object-cover"
          />
        </MemberProfileDetailCard.Image>

        <MemberProfileDetailCard.Information>
          <p>직업 : {member.job}</p>
          <p>키 : {member.height ?? '-'}cm</p>
          <p>나이 : {koreanAge}세</p>
          <p>MBTI : {member.mbti.mbti}</p>
          <p>관심사 : {member.interestCategory.join(', ')}</p>
        </MemberProfileDetailCard.Information>

        <MemberProfileDetailCard.LikeCountBadge>
          <motion.div
            style={{ color: isLiked ? '#f87171' : '#d1d5db' }}
            onClick={handleLikeToggle}
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
            {isLiked ? member.likeCount + 1 : member.likeCount}
          </motion.div>
        </MemberProfileDetailCard.LikeCountBadge>
      </MemberProfileDetailCard>

      <MemberProfileDetailCard.AboutMe>
        <Button
          onClick={handleDatingChatRequest}
          size="lg-full"
          color="cyan"
          rounded="lg"
          className="py-8"
        >
          ☕ 커피챗을 신청해보세요.
        </Button>

        <div className="flex flex-col">
          <h1 className="text-violet-500 mb-3">이런 얘기 많이 들어요</h1>
          <div className="flex flex-wrap gap-3 mb-10">
            {member.userFeedbacks?.map((fb, index) => (
              <TagBadge key={index}>{fb}</TagBadge>
            ))}
          </div>

          <h1 className="text-violet-500 mb-3">저는 이런 사람이에요</h1>
          <div className="flex flex-wrap gap-3 mb-10">
            {member.userIntroductions?.map((intro, index) => (
              <TagBadge key={index}>{intro}</TagBadge>
            ))}
          </div>
        </div>
      </MemberProfileDetailCard.AboutMe>

      {/* ✅ 로그인 모달 공통 컴포넌트 사용 */}
      {showLoginAlert && (
        <LoginRequiredModal onClose={() => setShowLoginAlert(false)} />
      )}
    </div>
  );
}
