'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import ProfileCard from '@/components/common/Profilecard';
import ProfileCardRoundOne from '@/components/common/ProfileCardRoundOne';
import { fetchSparkList } from '@/services/sparklist';

interface SparkUser {
  id: number;
  nickname: string;
  likeCount: number;
  birthday: string;
  region: string;
  profileImageUrl?: string;
}

interface RawUser {
  id: number;
  nickname: string;
  likeCount?: number;
  birthday: string;
  region: string;
  profile?: {
    profileImage?: { imageUrl: string }[];
  };
}

interface Match {
  user1: RawUser;
  user2: RawUser;
}

interface FetchSparkListResponse {
  matchList: Match[];
  likeList: RawUser[];
  coffeeChatList: RawUser[];
}

const getKoreanAge = (birthday: string): number => {
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
      const data: FetchSparkListResponse = await fetchSparkList();

      const matchList = data.matchList || [];
      const likeList = data.likeList || [];
      const coffeeChatList = data.coffeeChatList || [];

      const matchUsers = matchList.flatMap((m) => [m.user1, m.user2]);

      const simplify = (users: RawUser[]): SparkUser[] =>
        users.map((u) => ({
          id: u.id,
          nickname: u.nickname,
          likeCount: u.likeCount || 0,
          birthday: u.birthday,
          region: u.region,
          profileImageUrl: u.profile?.profileImage?.[0]?.imageUrl ?? '/default.png',
        }));

      setRoundProfiles(simplify(matchUsers));
      setLikeProfiles(simplify(likeList));
      setCoffeeChatProfiles(simplify(coffeeChatList));
    };

    fetchData();
  }, []);

  const handleClickMemberDetailMove = (id: number) => {
    router.push(`/members/${id}`);
  };

  const handleAccept = (id: number) => {
    router.push(`/chats/${id}`);
  };

  const handleReject = (id: number) => {
    setRoundProfiles(prev => prev.filter(p => p.id !== id));
  };

  const renderProfileCards = (
    profiles: SparkUser[],
  // eslint-disable-next-line no-unused-vars
    onAccept?: (id: number) => void,
  // eslint-disable-next-line no-unused-vars
    onReject?: (id: number) => void
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
            profileImageUrl={profile.profileImageUrl ?? "/default.png"}
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
              profileImageUrl={profile.profileImageUrl ?? "/default.png"}
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

      {/* 커피챗 신청 */}
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
    </main>
  );
}
