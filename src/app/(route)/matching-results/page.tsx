'use client';

import { useEffect, useState } from 'react';
import { fetchMatchResults, MatchResult } from '@/services/matchResult';
import Button from '@/components/common/Button';
import ProfileCard from '@/components/common/Profilecard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logofit from '@/assets/1.png';

export default function MatchingResultsPage() {
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFalse, setIsFalse] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadMatchResults = async () => {
      const data = await fetchMatchResults();
      setMatchResults(data);
    };
    loadMatchResults();
  }, []);

  // URL 쿼리로 success 값 받아서 팝업 상태 설정
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const successParam = searchParams.get('success');
    if (successParam === 'true') {
      setIsSuccess(true);
    } else if (successParam === 'false') {
      setIsFalse(true);
    }
  }, []);

  const handleClickChattingMove = () => {
    if (selectedMatch) {
      router.push(`/chats/${selectedMatch.currentUser.id}`);
    }
  };

  const handleClickMembersMove = () => {
    router.push('/members');
  };

  const handleShowResult = (match: MatchResult) => {
    setSelectedMatch(match);
    if (match.matched) {
      setIsSuccess(true);
    } else {
      setIsFalse(true);
    }
  };

  return (
    <div className="relative w-full min-h-full flex flex-col">
      {/* 성공 팝업 */}
      {isSuccess && (
        <div className="absolute z-10 w-full h-full bg-[rgba(0,0,0,0.7)] px-2 xs:px-8 py-10">
          <div className="bg-white w-full h-auto rounded-3xl flex flex-col mt-40 py-10 px-5">
            <h1 className="text-xs xs:text-xl text-center mb-5">
              &ldquo;매칭 성공! 🎊 새로운 인연이 시작됐어요.&ldquo;
            </h1>
            <div className="flex justify-between items-center">
              <div className="text-rose-300 text-xs xs:text-base">
                <p>두 분 모두 서로를 좋아했어요.</p>
                <p>
                  지금 바로 <span className="text-violet-500">커피챗</span>을
                  신청해보세요!
                </p>
              </div>
              <Button
                size="md"
                rounded="md"
                color="violet"
                onClick={handleClickChattingMove}
              >
                ☕️ 대화하러 가기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 실패 팝업 */}
      {isFalse && (
        <div className="absolute z-10 w-full h-full bg-[rgba(0,0,0,0.7)] px-2 xs:px-8 py-10">
          <div className="bg-white w-full h-auto rounded-3xl flex flex-col mt-40 py-10 px-5">
            <h1 className="text-xs xs:text-xl text-center mb-5">
              &ldquo;매칭 실패! 🙊 인연이 아니었습니다.&rdquo;
            </h1>
            <div className="flex justify-between items-center">
              <div className="text-rose-300 text-xs xs:text-base">
                <p>안타깝게도... 매칭에 실패했어요.</p>
                <p>더 매력적인 이성을 찾으러 가볼까요?</p>
              </div>
              <Button
                size="md"
                rounded="md"
                color="violet"
                onClick={handleClickMembersMove}
              >
                👀 회원 둘러보기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 매칭 결과 목록 */}
      <div className="flex flex-col gap-5 justify-center items-center px-5 py-10">
        {matchResults.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="flex gap-3 justify-center items-center py-10"
          >
            <Link href={`/members/${group.currentUser.id}`}>
              <ProfileCard
                name={group.currentUser.nickname}
                age={group.currentUser.age}
                likes={group.currentUser.likeCount}
                region={group.currentUser.region}
                isOnline={true}
                profileImageUrl={group.currentUser.profileImage}
              />
            </Link>

            {/* 결과 버튼은 유지할 수도 있고 제거 가능 */}
            <div className="flex flex-col gap-5 justify-center items-center">
              <Image src={logofit} alt="로고" width={70} height={100} />
              <Button
                rounded="md"
                size="sm"
                onClick={() => handleShowResult(group)}
              >
                결과 보기
              </Button>
            </div>

            <Link href={`/members/${group.selectedUser.id}`}>
              <ProfileCard
                name={group.selectedUser.nickname}
                age={group.selectedUser.age}
                likes={group.selectedUser.likeCount}
                region={group.selectedUser.region}
                isOnline={true}
                profileImageUrl={group.selectedUser.profileImage}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
