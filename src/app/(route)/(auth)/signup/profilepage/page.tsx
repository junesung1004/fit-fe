'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';  // 여기에서 useRouter를 가져옵니다.

const interestTags = ['운동', '영화', '여행', '요리', '카페투어', '뮤지컬', '술', '캠핑'];
const feedbackTags = ['동안', '예쁜 눈 웃음', '멋진 근육질', '비율이 좋아요', '귀여운 보조개'];
const selfDescTags = ['웃음이 많아요', '얘기를 잘 들어줘요', '예의가 발라요', '훌륭한 요리 실력'];

type TagSectionProps = {
  title: string;
  tags: string[];
  limit?: number;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
};

function TagSection({ title, tags, limit, selectedTags, setSelectedTags }: TagSectionProps) {
  const toggleTag = (tag: string) => {
    const already = selectedTags.includes(tag);
    if (already) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      if (!limit || selectedTags.length < limit) {
        setSelectedTags(prev => [...prev, tag]);
      }
    }
  };

  return (
    <div>
      <p className="text-sm mb-2 text-gray-700">{title}</p>
      <div className="flex flex-wrap gap-5 mt-4">
        {tags.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`px-4 py-3 text-sm rounded-full border transition-all
              ${
                selectedTags.includes(tag)
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-rose-300 text-white border-transparent'
              }`}
            style={{ height: '35px', display: 'flex', alignItems: 'center' }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function InterestAreaInput() {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-700">관심 지역</label>
      <div className="relative">
        <input
          className="w-full py-2 px-4 pr-10 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-300"
          placeholder="지역을 입력하세요"
        />
        <MagnifyingGlassIcon className="w-4 h-4 absolute top-3 right-3 text-rose-500" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [interestSelected, setInterestSelected] = useState<string[]>([]);
  const [feedbackSelected, setFeedbackSelected] = useState<string[]>([]);
  const [selfDescSelected, setSelfDescSelected] = useState<string[]>([]);

  const router = useRouter();  // 'next/navigation'에서 가져온 useRouter
  const handleNextClick = () => {
    router.push('/signup/profileimage'); // 절대 경로로 수정
  };

  return (
    <div >
      {/* 관심 지역 */}
      <InterestAreaInput />

      {/* 관심사 */}
      <TagSection
        title="관심사 (2~3개 선택)"
        tags={interestTags}
        limit={3}
        selectedTags={interestSelected}
        setSelectedTags={setInterestSelected}
      />

      {/* 이런 얘기 많이 들어요 */}
      <TagSection
        title="이런 얘기 많이 들어요"
        tags={feedbackTags}
        selectedTags={feedbackSelected}
        setSelectedTags={setFeedbackSelected}
      />

      {/* 저는 이런 사람이에요 */}
      <TagSection
        title="저는 이런 사람이에요"
        tags={selfDescTags}
        selectedTags={selfDescSelected}
        setSelectedTags={setSelfDescSelected}
      />

      <Button
        variant="fill"
        size="lg"
        rounded='full'
        color="rose"
        onClick={handleNextClick}
      >
      다음
      </Button>


    </div>
  );
}
