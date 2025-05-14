'use client';

import React, { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Button from '@/components/common/Button';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function ProfileImagesPage() {
  const [images, setImages] = useState<(File | null)[]>(Array(6).fill(null));
  const [previews, setPreviews] = useState<(string | null)[]>(
    Array(6).fill(null)
  );
  const [error, setError] = useState<string | null>(null);
  const [isImageValid, setIsImageValid] = useState(false);

  const validateImages = () => {
    const uploadedCount = images.filter(Boolean).length;
    const valid = uploadedCount >= 2;
    setIsImageValid(valid);
    setError(valid ? null : '최소 2장의 이미지를 등록해야 합니다.');
  };

  const handleImageChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 형식 체크
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const updatedImages = [...images];
    const updatedPreviews = [...previews];
    updatedImages[index] = file;
    updatedPreviews[index] = URL.createObjectURL(file);
    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
    setPreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[index] = null;
      return newPreviews;
    });
  };

  const handleSaveImages = () => {
    if (!isImageValid) {
      toast.error('최소 2장의 이미지를 업로드해주세요.');
      return;
    }

    // TODO: API 연동 후 구현
    toast.info('이미지 저장 기능은 준비 중입니다.');
  };

  React.useEffect(() => {
    validateImages();
  }, [images]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 헤더 섹션 */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-8">
            <h1 className="text-2xl font-bold text-white text-center">
              프로필 이미지 관리
            </h1>
            <p className="mt-2 text-rose-100 text-center">
              최소 2장의 이미지를 등록해주세요
            </p>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="p-6 space-y-8">
            {/* 이미지 업로드 섹션 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PhotoIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">
                    프로필 사진
                  </span>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {images.filter(Boolean).length}/6
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="relative group">
                    <input
                      type="file"
                      id={`photo-${index}`}
                      name={`photo-${index}`}
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)}
                      className="hidden"
                    />
                    <label
                      htmlFor={`photo-${index}`}
                      className="block aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden relative hover:bg-gray-100 transition-all duration-200"
                    >
                      {previews[index] ? (
                        <>
                          <Image
                            src={previews[index] as string}
                            alt={`preview-${index}`}
                            className="object-cover"
                            fill
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemoveImage(index);
                              }}
                              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                            >
                              <XMarkIcon className="w-5 h-5 text-gray-900" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <PhotoIcon className="w-8 h-8 mb-2" />
                          <span className="text-sm">이미지 추가</span>
                        </div>
                      )}
                      {index === 0 && (
                        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-white bg-rose-500 px-3 py-1 rounded-full shadow-sm">
                          대표
                        </span>
                      )}
                      {index === 1 && (
                        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-white bg-rose-500 px-3 py-1 rounded-full shadow-sm">
                          필수
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>

              {error && <p className="text-sm text-rose-500 mt-2">{error}</p>}

              {/* 가이드라인 */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  이미지 업로드 가이드라인
                </h3>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-2"></span>
                    대표 이미지와 필수 이미지는 반드시 등록해주세요
                  </li>
                  <li className="text-sm text-gray-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-2"></span>
                    이미지 크기는 5MB 이하여야 합니다
                  </li>
                  <li className="text-sm text-gray-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-2"></span>
                    JPG, PNG, GIF 형식의 이미지만 업로드 가능합니다
                  </li>
                </ul>
              </div>
            </div>

            {/* 저장 버튼 */}
            <Button
              type="button"
              size="full"
              variant="fill"
              color="rose"
              rounded="lg"
              disabled={!isImageValid}
              className="p-4 font-medium text-white shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-200"
              onClick={handleSaveImages}
            >
              프로필 이미지 저장하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
