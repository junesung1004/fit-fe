'use client';

import { FieldError, useForm } from 'react-hook-form';
import SocialInput from '@/components/page/social/SocialInput';
import SocialGenderSelector from '@/components/page/social/SocialGenderSelector';
import SocialRegionSelector from '@/components/page/social/SocialRegionSelector';
import Button from '@/components/common/Button';
import SocialMultiToggleButtonGroup from '@/components/page/social/SocialMultiToggleButtonGroup';
import React, { ChangeEvent, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  useSocialSignUpMutation,
  useSocialUploadImageMutataion,
} from '@/hooks/mutations/useSocialSignUpMutation';
import { SocialSignUpFormValues } from '@/types/social.type';
import { toast } from 'react-toastify';
import {
  useFeedbackQuery,
  useInterestsQuery,
  useIntroduceQuery,
} from '@/hooks/queries/useSignUpInfoQuery';
import SocialMbtiSelector from '@/components/page/social/SocialMbtiSelector';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function SocialSignUpPage() {
  const {
    register,
    setValue,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, dirtyFields, isValid },
  } = useForm<SocialSignUpFormValues>({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const selectedGender = watch('gender');
  const [images, setImages] = useState<(File | null)[]>(Array(6).fill(null));
  const [previews, setPreviews] = useState<(string | null)[]>(
    Array(6).fill(null)
  );
  const [uploadImageUrl, setUploadImageUrl] = useState<(string | null)[]>(
    Array(6).fill(null)
  );
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useSocialSignUpMutation();

  //회원가입 관심사, 피드백, 이런사람이에요 state
  const { data: interest, isLoading: isInterestLoading } = useInterestsQuery();
  const interestNames =
    interest?.map((el: { id: number; name: string }) => el.name) ?? [];
  const { data: feedback, isLoading: isFeedbackLoading } = useFeedbackQuery();
  const feedbackNames = Array.from(
    new Set(feedback?.map((el: { id: number; name: string }) => el.name) ?? [])
  ) as string[];
  const { data: introduce, isLoading: isIntroduceLoading } =
    useIntroduceQuery();
  const introduceNames = Array.from(
    new Set(introduce?.map((el: { id: number; name: string }) => el.name) ?? [])
  ) as string[];

  const { mutate: uploadImage } = useSocialUploadImageMutataion();

  const [isImageValid, setIsImageValid] = useState(false);

  const validateImages = useCallback(() => {
    const uploadedCount = images.filter(Boolean).length;
    const valid = uploadedCount >= 2;
    setIsImageValid(valid);
    setError(valid ? null : '최소 2장의 이미지를 등록해야 합니다.');
  }, [images]);

  const formatPhoneNumber = (value: string) => {
    const onlyNums = value.replace(/\D/g, '');
    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 8)
      return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
  };

  const formatBirthday = (value: string) => {
    const onlyNums = value.replace(/\D/g, '');
    if (onlyNums.length < 5) return onlyNums;
    if (onlyNums.length < 7)
      return `${onlyNums.slice(0, 4)}-${onlyNums.slice(4)}`;
    return `${onlyNums.slice(0, 4)}-${onlyNums.slice(4, 6)}-${onlyNums.slice(6, 8)}`;
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'phone' && value.phone) {
        const formattedPhone = formatPhoneNumber(value.phone);
        if (value.phone !== formattedPhone) {
          setValue('phone', formattedPhone);
        }
      }
      if (name === 'birthday' && value.birthday) {
        const formattedBirthday = formatBirthday(value.birthday);
        if (value.birthday !== formattedBirthday) {
          setValue('birthday', formattedBirthday);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const handleImageChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const updatedImages = [...images];
    const updatedPreviews = [...previews];
    updatedImages[index] = file;
    updatedPreviews[index] = URL.createObjectURL(file);
    setImages(updatedImages);
    setPreviews(updatedPreviews);

    uploadImage(file, {
      onSuccess: (s3Url) => {
        setUploadImageUrl((prev) => {
          const newUrls = [...prev];
          newUrls[index] = s3Url;
          return newUrls;
        });
      },
    });
  };

  const handleCreateUserSubmit = async (data: SocialSignUpFormValues) => {
    try {
      console.log('소셜 회원가입 시도: ', data);
      const validImageUrls = uploadImageUrl.filter(
        (url): url is string => url !== null && url !== undefined
      );
      if (validImageUrls.length < 2) {
        toast.error('최소 2장의 이미지를 업로드해주세요.');
        return;
      }
      const payload = {
        ...data,
        images: validImageUrls,
      };
      console.log('소셜 회원가입 전송 데이터: ', payload);
      mutate(payload);
    } catch (error) {
      console.error('회원가입 도중 에러 발생:', error);
    }
  };

  useEffect(() => {
    validateImages();
  }, [images, validateImages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-rose-50 py-10 px-5">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
            소셜 회원가입
          </h1>
          <p className="mt-2 text-sm text-zinc-600">추가 정보를 입력해주세요</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-rose-500/10 rounded-2xl blur-xl" />
          <form
            noValidate
            onSubmit={handleSubmit(handleCreateUserSubmit)}
            className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-zinc-200/50"
          >
            <div className="space-y-6">
              {/* 기본 정보 섹션 */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-zinc-800">
                  기본 정보
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SocialInput
                    id="name"
                    type="text"
                    label="이름"
                    required
                    placeholder="이름을 입력해주세요"
                    register={register('name', {
                      required: '이름은 필수 입력입니다.',
                      minLength: {
                        value: 2,
                        message: '2자리 이상 이름을 사용하세요.',
                      },
                    })}
                    error={errors.name as FieldError}
                    isDirty={dirtyFields.name}
                  />

                  <SocialInput
                    id="nickname"
                    type="text"
                    label="닉네임"
                    required
                    placeholder="닉네임을 입력해주세요"
                    register={register('nickname', {
                      required: '닉네임은 필수 입력입니다.',
                      minLength: {
                        value: 2,
                        message: '2자리 이상 닉네임을 사용하세요.',
                      },
                    })}
                    error={errors.nickname as FieldError}
                    isDirty={dirtyFields.nickname}
                  />

                  <SocialInput
                    id="height"
                    type="text"
                    label="키"
                    required
                    placeholder="숫자로 입력해주세요"
                    register={register('height', {
                      required: '키는 필수 입력입니다.',
                      minLength: {
                        value: 2,
                        message: '숫자로 2자리 이상 입력해주세요.',
                      },
                      pattern: {
                        value: /^[0-9]{2,}$/,
                        message:
                          '숫자만 입력 가능하며 2자리 이상이어야 합니다.',
                      },
                    })}
                    error={errors.height as FieldError}
                    isDirty={dirtyFields.height}
                  />

                  <SocialInput
                    id="job"
                    type="text"
                    label="직업"
                    required
                    placeholder="직업을 입력해주세요"
                    register={register('job', {
                      required: '직업은 필수 입력입니다.',
                      minLength: {
                        value: 2,
                        message: '2자리 이상 사용하세요.',
                      },
                    })}
                    error={errors.job as FieldError}
                    isDirty={dirtyFields.job}
                  />
                </div>
              </div>

              {/* 개인 정보 섹션 */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-zinc-800">
                  개인 정보
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SocialInput
                    id="birthday"
                    type="text"
                    label="생년월일"
                    required
                    placeholder="2000-01-01"
                    register={register('birthday', {
                      required: '생년월일은 필수 입력입니다.',
                      pattern: {
                        value: /^\d{4}-\d{2}-\d{2}$/,
                        message: '올바른 형식을 입력해주세요.',
                      },
                    })}
                    error={errors.birthday as FieldError}
                    isDirty={dirtyFields.birthday}
                  />

                  <SocialInput
                    id="phone"
                    type="text"
                    label="전화번호"
                    placeholder="010-1234-1234"
                    register={register('phone', {
                      pattern: {
                        value: /^\d{3}-\d{4}-\d{4}$/,
                        message: '올바른 형식을 입력해주세요.',
                      },
                    })}
                    error={errors.phone as FieldError}
                    isDirty={dirtyFields.phone}
                  />

                  <SocialGenderSelector
                    register={register('gender', {
                      required: '성별을 선택해주세요.',
                    })}
                    required
                    selectedGender={selectedGender}
                    error={errors.gender?.message as string}
                  />

                  <SocialRegionSelector
                    register={register}
                    error={errors.region?.message as string}
                    required
                  />

                  <SocialMbtiSelector
                    register={register}
                    error={errors.mbti?.message as string}
                    required
                  />
                </div>
              </div>

              {/* 관심사 섹션 */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-zinc-800">관심사</h2>
                <div className="space-y-6">
                  <SocialMultiToggleButtonGroup
                    label="관심사"
                    name="interests"
                    options={interestNames}
                    required
                    limit={3}
                    min={2}
                    register={register}
                    setValue={setValue}
                    trigger={trigger}
                    error={errors.interests as FieldError}
                    isLoading={isInterestLoading}
                  />

                  <SocialMultiToggleButtonGroup
                    label="이런 얘기 많이 들어요"
                    name="listening"
                    options={feedbackNames}
                    required
                    limit={3}
                    min={1}
                    register={register}
                    setValue={setValue}
                    trigger={trigger}
                    error={errors.listening as FieldError}
                    gridCols="grid-cols-2"
                    isLoading={isFeedbackLoading}
                  />

                  <SocialMultiToggleButtonGroup
                    label="저는 이런 사람이에요"
                    name="selfintro"
                    options={introduceNames}
                    required
                    limit={3}
                    min={1}
                    register={register}
                    setValue={setValue}
                    trigger={trigger}
                    error={errors.selfintro as FieldError}
                    gridCols="grid-cols-2"
                    isLoading={isIntroduceLoading}
                  />
                </div>
              </div>

              {/* 프로필 이미지 섹션 */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-zinc-800">
                  프로필 사진
                </h2>
                <div className="flex flex-wrap justify-center gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="group relative">
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
                        className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-100 to-rose-100 flex items-center justify-center cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        {previews[index] ? (
                          <>
                            <Image
                              src={previews[index] as string}
                              alt={`preview-${index}`}
                              className="object-cover w-full h-full"
                              fill
                            />
                            {/* 삭제 버튼 */}
                            <button
                              type="button"
                              className="absolute top-1 right-1 z-10 w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-rose-500 transition-colors duration-200"
                              onClick={(e) => {
                                e.preventDefault();
                                const updatedImages = [...images];
                                const updatedPreviews = [...previews];
                                const updatedUploadUrls = [...uploadImageUrl];
                                updatedImages[index] = null;
                                updatedPreviews[index] = null;
                                updatedUploadUrls[index] = null;
                                setImages(updatedImages);
                                setPreviews(updatedPreviews);
                                setUploadImageUrl(updatedUploadUrls);
                              }}
                              tabIndex={-1}
                              aria-label="사진 삭제"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-3xl text-zinc-400 group-hover:text-zinc-600 transition-colors duration-300">
                            +
                          </span>
                        )}
                        {index === 0 && (
                          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-white bg-gradient-to-r from-violet-500 to-rose-500 px-2 py-0.5 rounded-full">
                            대표
                          </span>
                        )}
                        {index === 1 && (
                          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-white bg-gradient-to-r from-violet-500 to-rose-500 px-2 py-0.5 rounded-full">
                            필수
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
                {error && <small className="text-rose-500">{error}</small>}
              </div>
            </div>

            {/* 제출 버튼 */}
            <Button
              type="submit"
              size="full"
              variant="fill"
              color="rose"
              rounded="full"
              disabled={!isValid || !isImageValid || isPending}
              isLoading={isPending}
              className="mt-8 p-4 bg-gradient-to-r from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              가입완료
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
