'use client';

import { FieldError, useForm } from 'react-hook-form';
import InputField from '@/components/common/InputField';
import GenderSelector from '@/components/common/GenderSelector';
import RegionSelector from '@/components/common/RegionSelector';
import Button from '@/components/common/Button';
import MultiToggleButtonGroup from '@/components/common/MultiToggleButtonGroup';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { useSignUpMutation } from '@/hooks/mutation/useSignUpMutation';
import { SignUpFormValues } from '@/types/signUp.type';

const INTERESTS = [
  '운동',
  '영화',
  '여행',
  '요리',
  '카페투어',
  '뮤지컬',
  '술',
  '캠핑',
];

const LISTENING = [
  '동안',
  '예쁜 눈 웃음',
  '건강한 몸매',
  '비율이 좋아요',
  '귀여운 보조개',
  '애교 많음',
];

const SELPINTRO = [
  '웃음이 많아요',
  '배려심 깊어요',
  '적극적이에요',
  '예의가 발라요',
  '애교가 넘쳐요',
  '털털한 편이에요',
  '훌륭한 요리실력',
];

const MBTI = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
];

export default function SignUpPage() {
  const {
    register,
    setValue,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, dirtyFields, isValid },
  } = useForm<SignUpFormValues>({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const password = watch('password');
  const selectedGender = watch('gender');

  // const [emailCheckResult, setEmailCheckResult] = React.useState<
  //   'valid' | 'invalid' | null
  // >(null);

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
  const { mutate, isPending } = useSignUpMutation();

  useEffect(() => {
    validateImages();
  }, [images]);

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
  };

  // 이메일 중복확인 함수
  const checkEmailDuplicate = () => {
    const currentEmail = watch('email');

    if (!currentEmail) {
      alert('이메일을 입력해주세요');
      return;
    }
  };

  useEffect(() => {
    validateImages();
  }, [images]);

  const handleCreateUserSubmit = (data: SignUpFormValues) => {
    mutate(data);
  };

  return (
    <div className="w-full min-h-full py-10 px-5">
      <form
        noValidate
        onSubmit={handleSubmit(handleCreateUserSubmit)}
        className="flex flex-col gap-3"
      >
        {/* 이메일 필드 */}
        <InputField
          id="email"
          type="email"
          label="이메일"
          required
          placeholder="test@email.com"
          register={register('email', {
            required: '이메일은 필수 입력입니다.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '올바른 이메일 형식을 입력해주세요.',
            },
          })}
          error={errors.email as FieldError}
          isDirty={dirtyFields.email}
        />
        <Button
          type="button"
          size="full"
          rounded="full"
          onClick={checkEmailDuplicate}
        >
          이메일 중복 확인
        </Button>
        {/* {emailCheckResult === 'invalid' && (
          <small className="text-red-400">이미 등록된 이메일입니다.</small>
        )}
        {emailCheckResult === 'valid' && (
          <small className="text-green-500">가입이 가능한 이메일입니다.</small>
        )} */}

        {/* 비밀번호 필드 */}
        <InputField
          id="password"
          type="password"
          label="비밀번호"
          required
          placeholder="********"
          register={register('password', {
            required: '비밀번호는 필수 입력입니다.',
            minLength: {
              value: 8,
              message: '8자리 이상 비밀번호를 사용하세요.',
            },
          })}
          error={errors.password as FieldError}
          isDirty={dirtyFields.password}
        />

        {/* 비밀번호 확인 필드 */}
        <InputField
          id="confirmPassword"
          type="password"
          label="비밀번호 확인"
          required
          placeholder="********"
          register={register('confirmPassword', {
            required: '비밀번호 확인은 필수입니다.',
            validate: (value) =>
              value === password || '비밀번호가 일치하지 않습니다.',
          })}
          error={errors.confirmPassword as FieldError}
          isDirty={dirtyFields.confirmPassword}
        />

        {/* 이름 필드 */}
        <InputField
          id="name"
          type="text"
          label="이름"
          required
          placeholder="닉네임을 입력해주세요"
          register={register('name', {
            required: '닉네임은 필수 입력입니다.',
            minLength: {
              value: 2,
              message: '2자리 이상 닉네임을 사용하세요.',
            },
          })}
          error={errors.nickname as FieldError}
          isDirty={dirtyFields.nickname}
        />

        {/* 닉네임 필드 */}
        <InputField
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

        {/* 직업 필드 */}
        <InputField
          id="job"
          type="text"
          label="직업"
          required
          placeholder="닉네임을 입력해주세요"
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

        {/* 성별 필드 */}
        <GenderSelector
          register={register}
          required
          selectedGender={selectedGender}
          error={errors.gender?.message as string}
        />

        {/* 생년월일 필드 */}
        <InputField
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

        {/* 지역 필드 */}
        <RegionSelector
          register={register}
          error={errors.address?.message as string}
          required
        />

        {/* 휴대폰번호 필드 */}
        <InputField
          id="phoneNumber"
          type="text"
          label="전화번호"
          placeholder="010-1234-1234"
          register={register('phoneNumber', {
            pattern: {
              value: /^\d{3}-\d{4}-\d{4}$/,
              message: '올바른 형식을 입력해주세요.',
            },
          })}
          error={errors.phoneNumber as FieldError}
          isDirty={dirtyFields.phoneNumber}
        />

        {/* MBTI 필드 */}
        <MultiToggleButtonGroup
          label="MBTI"
          name="mbti"
          options={MBTI}
          required
          limit={1}
          min={1}
          register={register}
          setValue={setValue}
          trigger={trigger}
          error={errors.mbti as FieldError}
        />

        {/* 관심사 필드 */}
        <MultiToggleButtonGroup
          label="관심사"
          name="interests"
          options={INTERESTS}
          required
          limit={3}
          min={2}
          register={register}
          setValue={setValue}
          trigger={trigger}
          error={errors.interests as FieldError}
        />

        {/* 이런 얘기 많이 들어요 필드 */}
        <MultiToggleButtonGroup
          label="이런 얘기 많이 들어요"
          name="listening"
          options={LISTENING}
          required
          limit={3}
          min={1}
          register={register}
          setValue={setValue}
          trigger={trigger}
          error={errors.listening as FieldError}
        />

        {/* 저는 이런 사람이에요 필드 */}
        <MultiToggleButtonGroup
          label="저는 이런 사람이에요"
          name="selfintro"
          options={SELPINTRO}
          required
          limit={3}
          min={1}
          register={register}
          setValue={setValue}
          trigger={trigger}
          error={errors.selfintro as FieldError}
        />

        {/* 프로필 이미지 필드 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            프로필 사진 <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap justify-center gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
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
                  className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden relative"
                >
                  {previews[index] ? (
                    <Image
                      src={previews[index] as string}
                      alt={`preview-${index}`}
                      className="object-cover"
                      fill
                    />
                  ) : (
                    <span className="text-3xl text-gray-400 font-bold">+</span>
                  )}
                  {index === 0 && (
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-white bg-pink-400 px-2 rounded-full">
                      대표
                    </span>
                  )}
                  {index === 1 && (
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-white bg-pink-400 px-2 rounded-full">
                      필수
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
          {error && <small className="text-red-400">{error}</small>}
        </div>

        {/* 폼 제출 버튼 */}
        <button
          type="submit"
          disabled={!isValid || !isImageValid || isPending}
          className="w-full p-4 rounded-full text-white bg-rose-500
            hover:bg-rose-600
            disabled:bg-gray-300
            disabled:cursor-not-allowed
            disabled:opacity-50"
        >
          {isPending ? '가입 중...' : '가입완료'}
        </button>
      </form>
    </div>
  );
}
