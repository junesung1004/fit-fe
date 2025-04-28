'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyProfile } from '@/services/user';

interface UserProfile {
  nickname: string;
  profileImage: string;
}

export default function ProfileEdit() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null); // null이면 비로그인
  const [imgFile, setImgFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMyProfile(); // 로그인된 유저 정보 가져오기
        setUser(data);
      } catch {
        setUser(null); // 비로그인 처리
      }
    };
    fetchUser();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return alert('파일이 등록되지 않았습니다.');
    const imageUrl = URL.createObjectURL(file);
    setImgFile(imageUrl);
  };

  // 비로그인 상태일 때
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center mt-20">
        <p className="text-xl mb-4">로그인이 필요합니다.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-violet-500 text-white rounded"
        >
          로그인 하러 가기
        </button>
      </div>
    );
  }

  // 로그인 상태일 때 프로필 편집 UI
  const displayedImage = imgFile || user.profileImage || '/default.png';

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative w-[130px] h-[130px] rounded-full overflow-hidden">
        <Image
          src={displayedImage}
          alt="프로필 이미지"
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="relative flex flex-col justify-center items-center">
        <div className="absolute cursor-pointer bg-white flex justify-center items-center w-[40px] h-[40px] rounded-full border border-black mb-20">
          <label htmlFor="profile-upload">
            <Image
              src="/icons/edit.png"
              alt="프로필 편집"
              width={24}
              height={24}
              className="cursor-pointer"
            />
          </label>
        </div>

        <input
          id="profile-upload"
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <span className="text-3xl mt-10">{user.nickname || '닉네임 없음'}</span>
      </div>
    </div>
  );
}
