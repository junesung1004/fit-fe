'use client';

import Button from '@/components/common/Button';
import TagBadge from '@/components/common/TagBadge';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface friendType {
  id: number;
  name: string;
  age: number;
  height: number;
  imgUrl: string;
}

const friendDummyData: friendType[] = [
  { id: 1, name: '박준성', age: 34, height: 176, imgUrl: '/june.jpg' },
  { id: 2, name: '차은우', age: 20, height: 186, imgUrl: '/cha.jpg' },
];

export default function ChatsPage() {
  const [friends] = useState<friendType[]>(friendDummyData);

  return (
    <div className="w-full min-h-full flex flex-col gap-10 items-center py-6 px-5">
      {friends ? (
        friendDummyData.map((friend) => (
          <div
            key={friend.id}
            className="px-5 py-5 w-full h-auto border border-rose-500 rounded-lg flex gap-9  justify-center items-center"
          >
            {/* 프로필 이미지 */}
            <div className="relative w-[120px] h-[120px]">
              <Image
                src={friend.imgUrl}
                alt="프로필이미지"
                fill
                className="object-cover rounded-md"
              />
            </div>
            {/* 유저 정보 */}
            <div className="flex">
              <div className="flex flex-col  gap-2">
                <TagBadge>이름 : {friend.name}</TagBadge>
                <TagBadge>나이 : {friend.age}</TagBadge>
                <TagBadge>키 : {friend.height}</TagBadge>
              </div>
            </div>
            {/* 대화하러 가기 */}
            <Link
              href={`/chats/${friend.id}`}
              className="bg-slate-400 px-6 py-4 rounded-2xl text-white transition-all duration-300 hover:bg-slate-600 active:bg-slate-800"
            >
              대화방 👀
            </Link>
          </div>
        ))
      ) : (
        <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
          <div className="relative w-[65px] h-[65px]">
            <Image src={'/icons/crying-face.png'} alt="우는 아이콘" fill />
          </div>
          <span className="text-gray-400 text-2xl">채팅 목록이 없어요</span>
          <Button size="lg" rounded="full" variant="outline">
            라운드 선택하러 가기
          </Button>
        </div>
      )}
    </div>
  );
}
