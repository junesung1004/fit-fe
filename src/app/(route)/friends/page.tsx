'use client'; // 클라이언트 컴포넌트로 지정
import Button from '@/components/common/Button';
import Profilecard from '@/components/common/Profilecard';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MatchingPage() {
  // 더미 데이터
  const dummyProfiles = [
    { id: 1, name: '친구 1', age: 20, region: '경기', profileImageUrl: '/seo.jpg' },
    { id: 2, name: '친구 2', age: 21, region: '서울', profileImageUrl: '/seo.jpg' },
    { id: 3, name: '친구 3', age: 22, region: '서울', profileImageUrl: '/seo.jpg' },
    { id: 4, name: '친구 4', age: 23, region: '서울', profileImageUrl: '/seo.jpg' },
    { id: 5, name: '친구 5', age: 24, region: '서울', profileImageUrl: '/seo.jpg' },
    { id: 6, name: '친구 6', age: 25, region: '서울', profileImageUrl: '/seo.jpg' },
    { id: 7, name: '친구 7', age: 25, region: '서울', profileImageUrl: '/seo.jpg' }
  ];

  // 1라운드와 호감 표시 섹션에 대한 각각의 상태를 관리
  const [roundProfiles, setRoundProfiles] = useState(dummyProfiles.slice(0, 3)); // 처음엔 3개만 표시
  const [likeProfiles, setLikeProfiles] = useState(dummyProfiles.slice(0, 3)); // 처음엔 3개만 표시
  const [isRoundExpanded, setIsRoundExpanded] = useState(false); // 1라운드 펼침 상태
  const [isLikeExpanded, setIsLikeExpanded] = useState(false); // 호감표시 펼침 상태
  const router = useRouter()
  const handleClickMemberDetailMove = ()=>{
    router.push('/members/123')
  }
  const renderImageCards = (profiles: typeof dummyProfiles) => (
    <div className="grid grid-cols-3 gap-2 py-2 cursor-pointer" onClick={handleClickMemberDetailMove}>
      {profiles.map((profile) => (
        <Profilecard
          key={profile.id}
          name={profile.name}
          age={profile.age}
          region={profile.region}
          isOnline={profile.id % 2 === 0}  // 온라인 상태가 번갈아가며 표시
          profileImageUrl={profile.profileImageUrl}
        />
      ))}
    </div>
  );

  // 1라운드 섹션 더보기 버튼 클릭 시 동작
  const loadMoreRoundProfiles = () => {
    setRoundProfiles(dummyProfiles); // 전체 프로필 표시
    setIsRoundExpanded(true); // 더보기 클릭 시 펼치기 상태로 변경
  };

  // 호감 표시 섹션 더보기 버튼 클릭 시 동작
  const loadMoreLikeProfiles = () => {
    setLikeProfiles(dummyProfiles); // 전체 프로필 표시
    setIsLikeExpanded(true); // 더보기 클릭 시 펼치기 상태로 변경
  };

  // 1라운드 펼치기/접기 토글
  const toggleRoundExpand = () => {
    if (isRoundExpanded) {
      setRoundProfiles(dummyProfiles.slice(0, 3)); // 접을 경우 처음 3개만 보이도록
    } else {
      setRoundProfiles(dummyProfiles); // 펼칠 경우 전체 데이터 보이도록
    }
    setIsRoundExpanded(!isRoundExpanded);
  };

  // 호감표시 펼치기/접기 토글
  const toggleLikeExpand = () => {
    if (isLikeExpanded) {
      setLikeProfiles(dummyProfiles.slice(0, 3)); // 접을 경우 처음 3개만 보이도록
    } else {
      setLikeProfiles(dummyProfiles); // 펼칠 경우 전체 데이터 보이도록
    }
    setIsLikeExpanded(!isLikeExpanded);
  };

  return (
    <main className="flex-1 px-8 space-y-6 pb-10 overflow-auto">
      {/* 1ROUND */}
      <section className="pt-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">1ROUND</h2>
          <Button size="sm" variant="outline" color="rose" className="text-xs">
            ✏️ 편집
          </Button>
        </div>

        {/* 1ROUND에 3개씩만 가로로 나오도록 설정 */}
        {renderImageCards(roundProfiles)} {/* 3개씩 묶은 데이터를 렌더링 */}

        {/* 1라운드 + 더보기 버튼 조건부 렌더링 */}
        {!isRoundExpanded && (
          <Button className="w-full mt-2" variant="fill" color="rose" onClick={loadMoreRoundProfiles}>
            + 전체 보기
          </Button>
        )}
        
        {/* 1라운드 펼치기/접기 버튼 */}
        {isRoundExpanded && (
          <Button className="w-full mt-2" variant="outline" color="rose" onClick={toggleRoundExpand}>
            접기
          </Button>
        )}
      </section>

      {/* 호감표시 */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">호감 표시</h2>
          <Button size="sm" variant="outline" color="violet" className="text-xs">
            ✏️ 편집
          </Button>
        </div>

        {/* 호감표시에도 3개씩만 가로로 나오도록 설정 */}
        {renderImageCards(likeProfiles)} {/* 3개씩 묶은 데이터를 렌더링 */}

        {/* 호감표시 + 더보기 버튼 조건부 렌더링 */}
        {!isLikeExpanded && (
          <Button className="w-full mt-2" variant="fill" color="violet" onClick={loadMoreLikeProfiles}>
            + 전체 보기
          </Button>
        )}
        
        {/* 호감표시 펼치기/접기 버튼 */}
        {isLikeExpanded && (
          <Button className="w-full mt-2" variant="outline" color="violet" onClick={toggleLikeExpand}>
            접기
          </Button>
        )}
      </section>
    </main>
  );
}
