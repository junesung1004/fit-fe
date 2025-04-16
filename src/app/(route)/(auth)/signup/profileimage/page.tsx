'use client'; // 클라이언트 사이드에서 실행되도록 설정

import { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid'; // Heroicons에서 plus-circle 아이콘 사용
import Button from '@/components/common/Button';

export default function ProfileImagePage() {
  const [profileImages, setProfileImages] = useState<string[]>(['', '', '', '', '', '']);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    // 이미지 파일 선택 창 열기
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
  
    // 파일이 선택되었을 때 실행될 로직
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]; // HTMLInputElement로 타입 단언
      if (file) {
        // 선택된 이미지를 URL로 변환하여 해당 위치에 업데이트
        const updatedImages = [...profileImages];
        const imageUrl = URL.createObjectURL(file); // 파일 URL 생성
        updatedImages[index] = imageUrl; // 이미지 URL을 해당 인덱스에 설정
        setProfileImages(updatedImages);
        setSelectedImage(index); // 선택된 이미지 인덱스를 상태로 설정
      }
    };
  
    // 파일 선택 창 열기
    fileInput.click();
  };
  

  return (
    <div className="max-w-md mx-auto px-10 py-8 space-y-12">
      {/* 프로필 사진 텍스트 */}
      <h2 className="text-2xl font-semibold text-gray-700">프로필 사진</h2>

      {/* 프로필 사진 6개 */}
      <div className="grid grid-cols-3 gap-4 mt-6">
  {profileImages.map((image, index) => (
    <div key={index} className="relative w-24 h-24">
      {/* 첫 번째 동그라미 위에 (대표) 텍스트 */}
      {index === 0 && (
        <div className="absolute -top-7 left-7 text-xs text-white bg-rose-300 p-1 rounded-full flex items-center justify-center z-10">
          (대표)
        </div>
      )}
      <div
        className={`relative w-full h-full rounded-full bg-gray-200 overflow-hidden cursor-pointer ${
          image ? '' : 'flex items-center justify-center'
        }`}
        onClick={() => handleImageClick(index)} // 이미지 클릭 시 이미지 변경
      >
        {image ? (
          <img
            src={image}
            alt={`Profile ${index + 1}`}
            className={`w-full h-full object-cover ${selectedImage === index ? 'border-4 border-blue-500' : ''}`} // 선택된 이미지에 스타일 적용
          />
        ) : (
          <div className="absolute right-0 mt-16 mr-2 z-10 text-black text-xl">
            <PlusCircleIcon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  ))}
</div>


      {/* 가입완료 버튼 */}
      <Button size="lg" variant="fill" color="rose" className="mx-auto">
        가입 완료
      </Button>
    </div>
  );
}
