'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getMyProfile } from '@/services/user'; // ✅ 서비스에서 가져오기

interface UserProfile {
  nickname: string;
  profileImage: string;
}

export default function ProfileEdit() {
  const [user, setUser] = useState<UserProfile>({ nickname: '', profileImage: '' });
  const [imgFile, setImgFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMyProfile(); // ✅ 서비스 함수 호출
        setUser(data);
      } catch (err) {
        console.error('유저 정보를 불러오는 데 실패했습니다.', err);
      }
    };
    fetchUser();
  }, []);

  const displayedImage = imgFile || user.profileImage || '/default.png';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return alert('파일이 등록되지 않았습니다.');
    const imageUrl = URL.createObjectURL(file);
    setImgFile(imageUrl);
  };

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
