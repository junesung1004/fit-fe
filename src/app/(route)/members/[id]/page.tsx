'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/solid';
import TagBadge from '@/components/common/TagBadge';
import MemberProfileDetailCard from '@/components/common/ProfileDetailCard';
import Button from '@/components/common/Button';
import { sendNotification } from '@/services/notification';
import { likeMember, getLikeStatus } from '@/services/like';
import { fetchUserInfo, MemberDetailResponse } from '@/services/memberDetail';
import { useAuthStore } from '@/store/authStore';
import { useLikeStore } from '@/store/likeStore';
import LoginRequiredModal from '@/components/common/LoginRequiredModal';
import { toast } from 'react-toastify';
import { useSendCoffeeChatMutation } from '@/hooks/mutations/useSendCoffeeChatMutation';
import { isAxiosError } from '@/lib/error';

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { isLoggedIn } = useAuthStore();
  const { setLikeChanged } = useLikeStore();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [member, setMember] = useState<MemberDetailResponse | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [, setCoffeeChatId] = useState<string | null>(null);
  const sendCoffeeChatMutation = useSendCoffeeChatMutation();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const data = await fetchUserInfo(userId);
        setMember(data);
        setLikeCount(data.likeCount);
        const likeStatus = await getLikeStatus(userId);
        setIsLiked(likeStatus);
      } catch (error) {
        if (isAxiosError(error)) {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage || '멤버 정보를 불러오는데 실패했습니다.');
        } else {
          toast.error('멤버 정보를 불러오는데 실패했습니다.');
        }
      }
    };
    getUserInfo();
  }, [userId]);

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }

    if (!userId) return toast.error('상대방 ID가 없습니다!');

    try {
      if (!isLiked) {
        // 좋아요 누르기
        await likeMember(userId);
        await sendNotification(userId, {
          type: 'LIKE',
          title: '좋아요 알림',
          content: '회원님을 마음에 들어하는 사람이 있어요 💕',
        });
        toast.success('좋아요 알림이 전송되었습니다!');
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      } else {
        // 좋아요 취소하기
        await likeMember(userId);
        toast.success('좋아요를 취소했습니다.');
        setLikeCount((prev) => (prev > 0 ? prev - 1 : 0));
        setIsLiked(false);
      }
      setLikeChanged(true);
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage || '좋아요 알림 요청에 실패했습니다.');
      } else {
        toast.error('좋아요 알림 요청에 실패했습니다.');
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleDatingChatRequest = async () => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }

    if (!userId) return toast.error('상대방 ID가 없습니다!');

    try {
      const response = await sendCoffeeChatMutation.mutateAsync({
        title: '커피챗 신청이 왔어요!',
        content: '커피챗을 신청하셨습니다. 확인해보세요 ☕',
        type: 'COFFEE_CHAT_REQUEST',
        receiverId: userId,
        data: {},
      });

      setCoffeeChatId(response.coffeeChatId);

      await sendNotification(userId, {
        type: 'coffee_chat_request',
        title: '커피챗 신청',
        content: '커피챗 요청이 도착했어요 ☕',
      });

      toast.success('커피챗 신청이 완료되었습니다!');
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage?.includes('이미 요청된 커피챗이 존재합니다')) {
          toast.warning(
            '이미 요청된 커피챗이 존재합니다. 상대방의 응답을 기다려주세요.'
          );
        } else {
          toast.error(
            errorMessage ||
              '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          );
        }
      } else {
        toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  if (!member) return <div>로딩 중...</div>;

  const mainImage = member.profileImage ?? '/default.png';
  const koreanAge = member.age;

  return (
    <div className="w-full min-h-full flex flex-col gap-4 px-2 xs:px-20 py-5">
      {/* 상단 뒤로가기 (글자 없이 화살표만) */}
      <button className="absolute top-22 left-6" onClick={handleBack}>
        <ArrowLeftIcon className="w-6 h-6 text-gray-500" />
      </button>

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
            key={likeCount}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {likeCount}
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

      {showLoginAlert && (
        <LoginRequiredModal onClose={() => setShowLoginAlert(false)} />
      )}
    </div>
  );
}
