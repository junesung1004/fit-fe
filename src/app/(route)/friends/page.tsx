'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import ProfileCard from '@/components/common/Profilecard';
import ProfileCardRoundOne from '@/components/common/ProfileCardRoundOne';
import { fetchSparkList, MatchItem, LikeUser, CoffeeChatUser } from '@/services/sparklist';
import { passMatchRequest } from '@/services/passMatch'; // ✅ 거절 API
import { acceptMatchRequest } from '@/services/acceptMatch';

interface SparkUser {
  id: string;
  nickname: string;
  likeCount: number;
  birthday: string | null;
  region: string;
  profileImage: string;
}

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

      const simplifiedMatchList: SparkUser[] = data.matchList.map((item: MatchItem) => ({
        id: item.matchedUserId,
        nickname: item.nickname,
        likeCount: item.likeCount,
        birthday: item.age ? `${new Date().getFullYear() - item.age + 1}-01-01` : null,
        region: item.region,
        profileImage: item.profileImage ?? '/default.png',
        isSuccess:item.isSuccess,
      }));

      const simplifiedLikeList: SparkUser[] = data.likeList.map((item: LikeUser) => ({
        id: item.likeUserid,
        nickname: item.nickname,
        likeCount: item.likeCount,
        birthday: item.age ? `${new Date().getFullYear() - item.age + 1}-01-01` : null,
        region: item.region,
        profileImage: item.profileImage ?? '/default.png',
      }));

      const simplifiedCoffeeChatList: SparkUser[] = data.coffeeChatList.map((item: CoffeeChatUser) => ({
        id: item.CoffeeChatUserid,
        nickname: item.nickname,
        likeCount: item.likeCount,
        birthday: item.age ? `${new Date().getFullYear() - item.age + 1}-01-01` : null,
        region: item.region,
        profileImage: item.profileImage ?? '/default.png',
      }));

      setRoundProfiles(simplifiedMatchList);
      setLikeProfiles(simplifiedLikeList);
      setCoffeeChatProfiles(simplifiedCoffeeChatList);
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
      console.log('거절 응답:', response.data);
      const { isSuccess } = response.data;
      console.log('isSuccess 값:', isSuccess);

      // ✅ 매칭 결과 페이지로 이동하면서 쿼리 전달
      router.push(`/matching-result?success=${isSuccess}`);
    } catch (error) {
      console.error('거절 실패:', error);
    }
  };

  const renderProfileCards = (
    profiles: SparkUser[],
    // eslint-disable-next-line no-unused-vars
    onAccept?: (id: string) => void,
    // eslint-disable-next-line no-unused-vars
    onReject?: (id: string) => void
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
      {profiles.map((profile) =>
        onAccept && onReject ? (
          <ProfileCardRoundOne
            key={profile.id}
            name={profile.nickname}
            age={getKoreanAge(profile.birthday)}
            region={profile.region}
            likes={profile.likeCount}
            profileImageUrl={profile.profileImage}
            onAccept={() => onAccept(profile.id)}
            onReject={() => onReject(profile.id)}
            onClick={() => handleClickMemberDetailMove(profile.id)}
          />
        ) : (
          <div key={profile.id} onClick={() => handleClickMemberDetailMove(profile.id)}>
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
  <main className="flex-1 px-6 space-y-10 pb-16 bg-gray-50">
  {/* 월드컵 */}
  <section className="pt-10">
    <div className="flex justify-between items-center mb-2">
      <h2 className="font-semibold text-lg">월드컵</h2>
    </div>
    {renderProfileCards(
      roundProfiles.slice(0, isRoundExpanded ? undefined : 3),
      handleAccept,
      handleReject
    )}
    {roundProfiles.length >= 4 && (
      <Button
        className="w-full mt-2"
        variant={isRoundExpanded ? 'outline' : 'fill'}
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
      likeProfiles.slice(0, isLikeExpanded ? undefined : 3)
    )}
    {likeProfiles.length >= 4 && (
      <Button
        className="w-full mt-2"
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
      coffeeChatProfiles.slice(0, isCoffeeChatExpanded ? undefined : 2)
    )}
    {coffeeChatProfiles.length >= 4 && (
      <Button
        className="w-full mt-2"
        variant={isCoffeeChatExpanded ? 'outline' : 'fill'}
        onClick={() => setIsCoffeeChatExpanded(!isCoffeeChatExpanded)}
      >
        {isCoffeeChatExpanded ? '접기' : '+ 전체 보기'}
      </Button>
    )}
  </section>
</main>

  );
}
