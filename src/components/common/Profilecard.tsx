import React from 'react';
import Image from 'next/image';
import { useUserStatusStore } from '@/store/userStatusStore';

type ProfileCardProps = {
  name: string;
  age: number;
  region: string;
  likes?: number;
  userId: string;
  isOnline: boolean;
  profileImageUrl: string;
  onClick?: () => void;
};

const ProfileCard = ({
  name,
  age,
  region,
  likes = 0,
  userId,
  isOnline: isOnlineProp,
  profileImageUrl,
  onClick,
}: ProfileCardProps) => {
  const { userStatuses } = useUserStatusStore();
  const isOnline = userStatuses[userId] || isOnlineProp;

  return (
    <div
      className="w-[120px] p-4 bg-white rounded-lg shadow-md cursor-pointer"
      onClick={onClick}
    >
      {/* 프로필 이미지 */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 relative ">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 relative">
              <Image
                src={profileImageUrl || '/default.png'}
                alt="Profile Image"
                className="rounded-full object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 96px"
              />
            </div>
          </div>
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

      {/* 접속 상태 */}
      <div
        className={`text-center mt-2 ${
          isOnline ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {isOnline ? '● 접속 중' : '● 접속 종료'}
      </div>
    </div>
  );
};

export default ProfileCard;
