import React from 'react';


type ProfileCardProps = {
  name: string;
  age: number;
  region: string;
  likes?: number;
  isOnline: boolean;
  profileImageUrl: string; // 프로필 사진 URL
};

const ProfileCard = ({
  name,
  age,
  region,
  likes = 0,
  isOnline,
  profileImageUrl,
}: ProfileCardProps) => {
  return (
    <div className="w-[120px] p-4 bg-white rounded-lg shadow-md" >
      {/* 프로필 이미지 */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 relative ">
        <div className="flex justify-center mb-4">
  <div className="w-24 h-24 relative">
      <img
      src={profileImageUrl || '/default.png'}
      alt="Profile Image"
      className="rounded-full object-cover w-full h-full"
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
        {isOnline ? '● 접속 중' : '● 오프라인'}
      </div>
    </div>
  );
};

export default ProfileCard;
