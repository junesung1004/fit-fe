'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import ProfileCard from '@/components/common/Profilecard';
import ProfileCardRoundOne from '@/components/common/ProfileCardRoundOne';
import {
  fetchSparkList,
  MatchItem,
  LikeUser,
  CoffeeChatUser,
} from '@/services/sparklist';
import { passMatchRequest } from '@/services/passMatch';
import { acceptMatchRequest } from '@/services/acceptMatch';
import {
  acceptCoffeeChatRequest,
  rejectCoffeeChatRequest,
} from '@/services/chat';

interface SparkUser {
  id: string;
  nickname: string;
  likeCount: number;
  birthday: string | null;
  region: string;
  profileImage: string;
  coffeeChatId?: string;
  isSuccess?: boolean;
}

type ProfileType = 'match' | 'like' | 'coffee';
// eslint-disable-next-line no-unused-vars
type AcceptFn = ((id: string) => void) | ((chatId: string, userId: string) => void);

const removeDuplicates = (list: SparkUser[]) => {
  const seen = new Set();
  return list.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const getKoreanAge = (birthday: string | null): number => {
  if (!birthday) return 0;
  const birthYear = new Date(birthday).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear + 1;
};

export default function FriendsPage() {
  const router = useRouter();

  const [roundProfiles, setRoundProfiles] = useState<SparkUser[]>([]);
  const [likeProfiles, setLikeProfiles] = useState<SparkUser[]>([]);
  const [coffeeChatProfiles, setCoffeeChatProfiles] = useState<SparkUser[]>([]);

  const [isRoundExpanded, setIsRoundExpanded] = useState(false);
  const [isLikeExpanded, setIsLikeExpanded] = useState(false);
  const [isCoffeeChatExpanded, setIsCoffeeChatExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSparkList();

      const simplifiedMatchList: SparkUser[] = data.matchList.map(
        (item: MatchItem) => ({
          id: item.matchedUserId,
          nickname: item.nickname,
          likeCount: item.likeCount,
          birthday: item.age
            ? `${new Date().getFullYear() - item.age + 1}-01-01`
            : null,
          region: item.region,
          profileImage: item.profileImage ?? '/default.png',
          isSuccess: item.isSuccess,
        })
      );

      const simplifiedLikeList: SparkUser[] = data.likeList.map(
        (item: LikeUser) => ({
          id: item.likedUserId,
          nickname: item.nickname,
          likeCount: item.likeCount,
          birthday: item.age
            ? `${new Date().getFullYear() - item.age + 1}-01-01`
            : null,
          region: item.region,
          profileImage: item.profileImage ?? '/default.png',
        })
      );

      const simplifiedCoffeeChatList: SparkUser[] = data.coffeeChatList.map(
        (item: CoffeeChatUser) => ({
          id: item.coffeeChatUserId,
          nickname: item.nickname,
          likeCount: item.likeCount,
          birthday: item.age
            ? `${new Date().getFullYear() - item.age + 1}-01-01`
            : null,
          region: item.region,
          profileImage: item.profileImage ?? '/default.png',
          coffeeChatId: item.coffeeChatId,
        })
      );

      setRoundProfiles(removeDuplicates(simplifiedMatchList));
      setLikeProfiles(removeDuplicates(simplifiedLikeList));
      setCoffeeChatProfiles(removeDuplicates(simplifiedCoffeeChatList));
    };

    fetchData();
  }, []);

  const handleClickMemberDetailMove = (id: string) => {
    router.push(`/members/${id}`);
  };

  const handleAccept = async (id: string) => {
    try {
      const response = await acceptMatchRequest(id);
      console.log('매칭 수락 응답:', response.data);
      const { isSuccess } = response.data;
      console.log('isSuccess 값:', isSuccess);

      router.push(`/chats/${id}`);
    } catch (error) {
      console.error('매칭 수락 실패:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await passMatchRequest(id);
      router.push(`/matching-result?success=${response.data.isSuccess}`);
    } catch (error) {
      console.error('거절 실패:', error);
    }
  };

  const handleCoffeeAccept = async (coffeeChatId: string, userId: string) => {
    try {
      const res = await acceptCoffeeChatRequest(coffeeChatId);
      const chatRoomId = res.chatRoomId ?? userId;
      router.push(`/chats/${chatRoomId}?userId=${userId}`);
    } catch (error) {
      console.error('커피챗 수락 실패:', error);
    }
  };

  const handleCoffeeReject = async (id: string) => {
    try {
      await rejectCoffeeChatRequest(id);
      alert('커피챗 거절 완료!');
      setCoffeeChatProfiles((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error('커피챗 거절 실패:', error);
    }
  };

  const renderProfileCards = (
    profiles: SparkUser[],
    onAccept?: AcceptFn,
    // eslint-disable-next-line no-unused-vars
    onReject?: (id: string) => void,
    useRoundCard = true,
    type: ProfileType = 'match'
  ) => (
    <div className="grid grid-cols-3 gap-2 py-2">
      {profiles.map((profile) =>
        useRoundCard && onAccept && onReject ? (
          <ProfileCardRoundOne
            key={`${type}-${profile.id}`}
            name={profile.nickname}
            age={getKoreanAge(profile.birthday)}
            region={profile.region}
            likes={profile.likeCount}
            profileImageUrl={profile.profileImage}
            onClick={() => handleClickMemberDetailMove(profile.id)}
            onAccept={() => {
              if (type === 'coffee') {
                if (!profile.coffeeChatId) {
                  console.warn('⚠️ 커피챗 ID 없음:', profile);
                  return;
                }
                // eslint-disable-next-line no-unused-vars
                (onAccept as (chatId: string, userId: string) => void)(profile.coffeeChatId, profile.id);
              } else {
                // eslint-disable-next-line no-unused-vars
                (onAccept as (id: string) => void)(profile.id);
              }
            }}
            onReject={() => onReject(profile.id)}
          />
        ) : (
          <div
            key={`${type}-${profile.id}`}
            onClick={() => handleClickMemberDetailMove(profile.id)}
            className="cursor-pointer"
          >
            <ProfileCard
              name={profile.nickname}
              age={getKoreanAge(profile.birthday)}
              region={profile.region}
              likes={profile.likeCount}
              isOnline={true}
              profileImageUrl={profile.profileImage}
            />
          </div>
        )
      )}
    </div>
  );

  return (
    <main className="flex-1 px-6 space-y-10 pb-16">
      {/* 월드컵 */}
      <section className="pt-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">월드컵</h2>
        </div>
        {renderProfileCards(
          roundProfiles.slice(0, isRoundExpanded ? undefined : 3),
          handleAccept,
          handleReject,
          true,
          'match'
        )}
        {roundProfiles.length >= 4 && (
          <Button
            className="w-full mt-2"
            rounded="lg"
            variant={isRoundExpanded ? 'outline' : 'fill'}
            color="violet"
            onClick={() => setIsRoundExpanded(!isRoundExpanded)}
          >
            {isRoundExpanded ? '접기' : '+ 전체 보기'}
          </Button>
        )}
      </section>

      {/* 호감 표시 */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">호감 표시</h2>
        </div>
        {renderProfileCards(
          likeProfiles.slice(0, isLikeExpanded ? undefined : 3),
          undefined,
          undefined,
          false,
          'like'
        )}
        {likeProfiles.length >= 4 && (
          <Button
            className="w-full mt-2"
            rounded="lg"
            variant={isLikeExpanded ? 'outline' : 'fill'}
            color="violet"
            onClick={() => setIsLikeExpanded(!isLikeExpanded)}
          >
            {isLikeExpanded ? '접기' : '+ 전체 보기'}
          </Button>
        )}
      </section>

      {/* 커피챗 신청 */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">커피챗 신청</h2>
        </div>
        {renderProfileCards(
          coffeeChatProfiles.slice(0, isCoffeeChatExpanded ? undefined : 2),
          handleCoffeeAccept,
          handleCoffeeReject,
          true,
          'coffee'
        )}
        {coffeeChatProfiles.length >= 4 && (
          <Button
            className="w-full mt-2"
            rounded="lg"
            variant={isCoffeeChatExpanded ? 'outline' : 'fill'}
            color="violet"
            onClick={() => setIsCoffeeChatExpanded(!isCoffeeChatExpanded)}
          >
            {isCoffeeChatExpanded ? '접기' : '+ 전체 보기'}
          </Button>
        )}
      </section>
    </main>
  );
}