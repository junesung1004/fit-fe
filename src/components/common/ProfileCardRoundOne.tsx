import React from 'react';
import Image from 'next/image';

type ProfileCardRoundOneProps = {
  name: string;
  age: number;
  region: string;
  likes?: number;
  profileImageUrl: string;
  onAccept: () => void;
  onReject: () => void;
  onClick: () => void;
};

const ProfileCardRoundOne = ({
  name,
  age,
  region,
  likes = 0,
  profileImageUrl,
  onAccept,
  onReject,
  onClick,
}: ProfileCardRoundOneProps) => {
  return (
    <div
      className="w-[120px] p-4 bg-white rounded-lg shadow-md cursor-pointer" //
      onClick={onClick}
    >
      {/* 프로필 이미지 */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 relative">
          <Image
            src={profileImageUrl}
            alt="Profile Image"
            fill
            className="rounded-full"
          />
        </div>
      </div>

      {/* 이름 */}
      <p className="text-center text-xl font-semibold mb-2">{name}</p>

      {/* 좋아요 수 */}
      <div className="text-center">
        <p>❤️ {likes}</p>
      </div>

      {/* 나이, 지역 같은 줄에 표시 */}
      <div className="text-center text-sm text-gray-600 flex justify-center">
        <p>{age}세</p>
        <span className="mx-1">•</span>
        <p>{region}</p>
      </div>

      {/* 버튼들 */}
      <div className="flex justify-between mt-2 space-x-2">
        <button
          className="w-1/2 py-1 text-xs bg-violet-500 text-white rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onReject();
          }}
        >
          거절
        </button>
        <button
          className="w-1/2 py-1 text-xs bg-rose-500 text-white rounded-full"
          onClick={(e) => {
            e.stopPropagation(); // 이벤트 버블링 방지
            onAccept();
          }}
        >
          수락
        </button>
      </div>
    </div>
  );
};

export default ProfileCardRoundOne;
