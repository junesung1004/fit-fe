'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/common/Button';
import ProfileCard from '@/components/common/Profilecard';
import ProfileCardRoundOne from '@/components/common/ProfileCardRoundOne';

export default function FriendsPage() {
  const router = useRouter();

  const dummyProfiles = [
    {
      id: 1,
      name: '친구 1',
      age: 20,
      region: '경기',
      likes: 3,
      profileImageUrl: '/seo.jpg',
    },
    {
      id: 2,
      name: '친구 2',
      age: 21,
      region: '서울',
      likes: 5,
      profileImageUrl: '/seo.jpg',
    },
    {
      id: 3,
      name: '친구 3',
      age: 22,
      region: '서울',
      likes: 2,
      profileImageUrl: '/seo.jpg',
    },
    {
      id: 4,
      name: '친구 4',
      age: 23,
      region: '서울',
      likes: 1,
      profileImageUrl: '/seo.jpg',
    },
    {
      id: 5,
      name: '친구 5',
      age: 24,
      region: '서울',
      likes: 6,
      profileImageUrl: '/seo.jpg',
    },
    {
      id: 6,
      name: '친구 6',
      age: 25,
      region: '서울',
      likes: 4,
      profileImageUrl: '/seo.jpg',
    },
    {
      id: 7,
      name: '친구 7',
      age: 25,
      region: '서울',
      likes: 7,
      profileImageUrl: '/seo.jpg',
    },
  ];

  const [roundProfiles, setRoundProfiles] = useState(dummyProfiles.slice(0, 3));
  const [likeProfiles, setLikeProfiles] = useState(dummyProfiles.slice(0, 3));
  const [coffeeChatProfiles, setCoffeeChatProfiles] = useState(
    dummyProfiles.slice(0, 2)
  );
  const [isRoundExpanded, setIsRoundExpanded] = useState(false);
  const [isLikeExpanded, setIsLikeExpanded] = useState(false);
  const [isCoffeeChatExpanded, setIsCoffeeChatExpanded] = useState(false);

  const handleClickMemberDetailMove = (id: number) => {
    router.push(`/members/${id}`);
  };

  const handleAccept = (id: number) => {
    router.push(`/chats/${id}`);
  };

  const handleReject = (id: number) => {
    setRoundProfiles(roundProfiles.filter((profile) => profile.id !== id));
  };

  const renderRoundProfileCards = (profiles: typeof dummyProfiles) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
      {profiles.map((profile) => (
        <ProfileCardRoundOne
          key={profile.id}
          name={profile.name}
          age={profile.age}
          region={profile.region}
          likes={profile.likes}
          profileImageUrl={profile.profileImageUrl}
          onAccept={() => handleAccept(profile.id)}
          onReject={() => handleReject(profile.id)}
          onClick={() => handleClickMemberDetailMove(profile.id)}
        />
      ))}
    </div>
  );

  const renderLikeProfileCards = (profiles: typeof dummyProfiles) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          onClick={() => handleClickMemberDetailMove(profile.id)}
        >
          <ProfileCard
            name={profile.name}
            age={profile.age}
            region={profile.region}
            likes={profile.likes}
            isOnline={true}
            profileImageUrl={profile.profileImageUrl}
          />
        </div>
      ))}
    </div>
  );

  const renderCoffeeChatProfileCards = (profiles: typeof dummyProfiles) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          onClick={() => handleClickMemberDetailMove(profile.id)}
        >
          <ProfileCard
            name={profile.name}
            age={profile.age}
            region={profile.region}
            likes={profile.likes}
            isOnline={true}
            profileImageUrl={profile.profileImageUrl}
          />
        </div>
      ))}
    </div>
  );

  return (
    <main className="flex-1 px-6 space-y-10 pb-16 bg-gray-50">
      {/* 월드컵 섹션 */}
      <section className="pt-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">월드컵</h2>
        </div>

        {renderRoundProfileCards(roundProfiles)}

        {!isRoundExpanded ? (
          <Button
            className="w-full mt-2"
            variant="fill"
            onClick={() => {
              setRoundProfiles(dummyProfiles);
              setIsRoundExpanded(true);
            }}
          >
            + 전체 보기
          </Button>
        ) : (
          <Button
            className="w-full mt-2"
            variant="outline"
            onClick={() => {
              setRoundProfiles(dummyProfiles.slice(0, 3));
              setIsRoundExpanded(false);
            }}
          >
            접기
          </Button>
        )}
      </section>

      {/* 호감 표시 섹션 */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">호감 표시</h2>
          <Button size="sm" variant="outline" className="text-xs">
            ✏️ 편집
          </Button>
        </div>

        {renderLikeProfileCards(likeProfiles)}

        {!isLikeExpanded ? (
          <Button
            className="w-full mt-2"
            variant="fill"
            color="violet"
            onClick={() => {
              setLikeProfiles(dummyProfiles);
              setIsLikeExpanded(true);
            }}
          >
            + 전체 보기
          </Button>
        ) : (
          <Button
            className="w-full mt-2"
            variant="outline"
            color="violet"
            onClick={() => {
              setLikeProfiles(dummyProfiles.slice(0, 3));
              setIsLikeExpanded(false);
            }}
          >
            접기
          </Button>
        )}
      </section>

      {/* 커피챗 신청 섹션 */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">커피챗 신청</h2>
          <Button size="sm" variant="outline" className="text-xs">
            ✏️ 편집
          </Button>
        </div>

        {renderCoffeeChatProfileCards(coffeeChatProfiles)}

        {!isCoffeeChatExpanded ? (
          <Button
            className="w-full mt-2"
            variant="fill"
            onClick={() => {
              setCoffeeChatProfiles(dummyProfiles);
              setIsCoffeeChatExpanded(true);
            }}
          >
            + 전체 보기
          </Button>
        ) : (
          <Button
            className="w-full mt-2"
            variant="outline"
            onClick={() => {
              setCoffeeChatProfiles(dummyProfiles.slice(0, 2));
              setIsCoffeeChatExpanded(false);
            }}
          >
            접기
          </Button>
        )}
      </section>
    </main>
  );
}
