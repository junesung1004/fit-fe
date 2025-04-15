'use client';

import Image from 'next/image';
import React, { useState } from 'react';

export default function ProfileEdit() {
  const [imgFile, setImgFile] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return alert('파일이 등록되지 않았습니다.');
    }
    const imageUrl = URL.createObjectURL(file);
    setImgFile(imageUrl);
  };
  return (
    <div className="flex flex-col justify-center items-center">
      {/* 이미지 */}
      <div className="relative w-[130px] h-[130px] rounded-full overflow-hidden">
        <Image
          src={imgFile || `/강아지프로필.jpg`}
          alt="강아지사진"
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* 이미지 변경 및 닉네임 */}
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
          onChange={(e) => handleImageChange(e)}
        />
        <span className="text-3xl mt-10">박준성</span>
      </div>
    </div>
  );
}
