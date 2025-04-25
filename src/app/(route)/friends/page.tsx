'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import ProfileCard from '@/components/common/Profilecard';
import ProfileCardRoundOne from '@/components/common/ProfileCardRoundOne';
import { fetchSparkList, MatchItem, LikeUser } from '@/services/sparklist';

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
  // const [coffeeChatProfiles, setCoffeeChatProfiles] = useState<SparkUser[]>([]);

  const [isRoundExpanded, setIsRoundExpanded] = useState(false);
  const [isLikeExpanded, setIsLikeExpanded] = useState(false);
  // const [isCoffeeChatExpanded, setIsCoffeeChatExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSparkList();

      // matchList 변환
      const simplifiedMatchList: SparkUser[] = data.matchList.map((item: MatchItem) => ({
        id: item.matchedUserId,
        nickname: item.matchedNickname,
        likeCount: item.matchedLikeCount,
        birthday: item.matchedAge ? `${new Date().getFullYear() - item.matchedAge + 1}-01-01` : null,
        region: item.matchedRegion,
        profileImage: item.matchedProfileImage ?? '/default.png',
      }));

      // likeList 변환
      const simplifiedLikeList: SparkUser[] = data.likeList.map((item: LikeUser) => ({
        id: item.likeUserid,
        nickname: item.nickname,
        likeCount: item.likeCount,
        birthday: item.age ? `${new Date().getFullYear() - item.age + 1}-01-01` : null,
        region: item.region,
        profileImage: item.profileImage ?? '/default.png',
      }));

      // 상태 설정
      setRoundProfiles(simplifiedMatchList);
      setLikeProfiles(simplifiedLikeList);
      // setCoffeeChatProfiles(simplifiedCoffeeChatList);
    };

    fetchData();
  }, []);

  const handleClickMemberDetailMove = (id: string) => {
    router.push(`/members/${id}`);
  };

  const handleAccept = (id: string) => {
    router.push(`/chats/${id}`);
  };

  const handleReject = (id: string) => {
    setRoundProfiles(prev => prev.filter(p => p.id !== id));
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
        {renderProfileCards(roundProfiles.slice(0, isRoundExpanded ? undefined : 3), handleAccept, handleReject)}
        <Button
          className="w-full mt-2"
          variant={isRoundExpanded ? 'outline' : 'fill'}
          onClick={() => setIsRoundExpanded(!isRoundExpanded)}
        >
          {isRoundExpanded ? '접기' : '+ 전체 보기'}
        </Button>
      </section>

      {/* 호감 표시 */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">호감 표시</h2>
          <Button size="sm" variant="outline" className="text-xs">✏️ 편집</Button>
        </div>
        {renderProfileCards(likeProfiles.slice(0, isLikeExpanded ? undefined : 3))}
        <Button
          className="w-full mt-2"
          variant={isLikeExpanded ? 'outline' : 'fill'}
          color="violet"
          onClick={() => setIsLikeExpanded(!isLikeExpanded)}
        >
          {isLikeExpanded ? '접기' : '+ 전체 보기'}
        </Button>
      </section>

      {/*
      커피챗 신청
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">커피챗 신청</h2>
          <Button size="sm" variant="outline" className="text-xs">✏️ 편집</Button>
        </div>
        {renderProfileCards(coffeeChatProfiles.slice(0, isCoffeeChatExpanded ? undefined : 2))}
        <Button
          className="w-full mt-2"
          variant={isCoffeeChatExpanded ? 'outline' : 'fill'}
          onClick={() => setIsCoffeeChatExpanded(!isCoffeeChatExpanded)}
        >
          {isCoffeeChatExpanded ? '접기' : '+ 전체 보기'}
        </Button>
      </section>
      */}
    </main>
  );
}
