import React from 'react';
import HomeProfileCard from './HomeProfileCard';
import Mbti from '@/components/common/Mbti';
import Button from '@/components/common/Button';

export default function HomeProfileCardList() {
  return (
    <div className="flex gap-3">
      <HomeProfileCard backgroundImageUrl="/cha.jpg">
        <HomeProfileCard.Header>
          <Mbti>INFP</Mbti>
        </HomeProfileCard.Header>
        <HomeProfileCard.Body>
          <p className="text-white">박준성</p>
          <div className="flex gap-1 text-white text-sm">
            <p>32세</p>
            <p>● 인천</p>
            <p>● 160cm</p>
          </div>
        </HomeProfileCard.Body>
        <HomeProfileCard.Footer>
          <Button size="md" rounded="full" variant="outline">
            선택하기
          </Button>
        </HomeProfileCard.Footer>
      </HomeProfileCard>

      {/*  */}
      <HomeProfileCard backgroundImageUrl="/june.jpg">
        <HomeProfileCard.Header>
          <Mbti>INFP</Mbti>
        </HomeProfileCard.Header>
        <HomeProfileCard.Body>
          <p className="text-white">박준성</p>
          <div className="flex gap-3 text-white text-sm">
            <p>32세</p>
            <p>● 인천</p>
            <p>● 160cm</p>
          </div>
        </HomeProfileCard.Body>
        <HomeProfileCard.Footer>
          <Button size="md" rounded="full" variant="outline">
            선택하기
          </Button>
        </HomeProfileCard.Footer>
      </HomeProfileCard>
    </div>
  );
}
