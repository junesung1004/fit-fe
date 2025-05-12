'use client';

import { FieldError, useForm } from 'react-hook-form';
import InputField from '@/components/common/InputField';
import GenderSelector from '@/components/common/GenderSelector';
import RegionSelector from '@/components/common/RegionSelector';
import Button from '@/components/common/Button';
import MultiToggleButtonGroup from '@/components/common/MultiToggleButtonGroup';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  useEmailCheckMutation,
  useEmailSuccessMutation,
  useEmailVerificationMutation,
  useSignUpMutation,
  useUploadImageMutataion,
} from '@/hooks/mutations/useSignUpMutation';
import { SignUpFormValues } from '@/types/signUp.type';
import { toast } from 'react-toastify';
import {
  useFeedbackQuery,
  useInterestsQuery,
  useIntroduceQuery,
} from '@/hooks/queries/useSignUpInfoQuery';
import MbtiSelector from '@/components/common/MbtiSelctor';

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
  // const phone = watch('phone');
  // const birthday = watch('birthday');
  const [emailSuccessCode, setEmailSuccessCode] = useState('');
  const [images, setImages] = useState<(File | null)[]>(Array(6).fill(null));
  const [previews, setPreviews] = useState<(string | null)[]>(
    Array(6).fill(null)
  );
  const [uploadImageUrl, setUploadImageUrl] = useState<(string | null)[]>(
    Array(6).fill(null)
  );
  const [error, setError] = useState<string | null>(null);
  const [isImageValid, setIsImageValid] = useState(false);
  const { mutate, isPending } = useSignUpMutation();
  const [isEmailCode, setIsEmailCode] = useState(false);

  //회원가입 관심사, 피드백, 이런사람이에요 state
  const { data: interest } = useInterestsQuery();
  // console.log('관심사 : ', interest);
  const interestNames =
    interest?.map((el: { id: number; name: string }) => el.name) ?? [];
  // console.log('관심사 : ', interestNames);
  const { data: feedback } = useFeedbackQuery();
  const feedbackNames = Array.from(
    new Set(feedback?.map((el: { id: number; name: string }) => el.name) ?? [])
  ) as string[];
  //console.log('피드백 ㅣ ', feedbackNames);
  const { data: introduce } = useIntroduceQuery();
  // console.log('저는 이런사람이에요 : ', introduce);
  const introduceNames = Array.from(
    new Set(introduce?.map((el: { id: number; name: string }) => el.name) ?? [])
  ) as string[];

  const { mutate: sendVerificationEmail } = useEmailVerificationMutation();
  const { mutate: checkEmail } = useEmailCheckMutation((isAvailable) => {
    if (isAvailable) {
      setIsEmailCode(true);
      sendVerificationEmail(watch('email'));
    }
  });
  const { mutate: successEmail } = useEmailSuccessMutation();
  const { mutate: uploadImage } = useUploadImageMutataion();

  const validateImages = () => {
    const uploadedCount = images.filter(Boolean).length;
    const valid = uploadedCount >= 2;
    setIsImageValid(valid);
    setError(valid ? null : '최소 2장의 이미지를 등록해야 합니다.');
  };

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

  const checkEmailDuplicate = async () => {
    const currentEmail = watch('email');
    if (!currentEmail) {
      alert('이메일을 입력해주세요');
      return;
    }
    checkEmail(currentEmail);
  };

  const handleCreateUserSubmit = async (data: SignUpFormValues) => {
    try {
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
      mutate(payload);
    } catch (error) {
      console.error('회원가입 도중 에러 발생:', error);
    }
  };

  const handleClickEmailSuccess = (emailSuccessCode: string) => {
    successEmail(Number(emailSuccessCode));
    setIsEmailCode(false);
  };

  const handleChangeEmailCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailSuccessCode(e.target.value);
  };

  useEffect(() => {
    validateImages();
  }, [images]);

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
          size="md-full"
          rounded="full"
          onClick={checkEmailDuplicate}
          className="mb-4"
        >
          이메일 중복 확인
        </Button>

        {/*인증코드 필드*/}
        {isEmailCode && (
          <div className="flex items-center gap-3">
            <input
              value={emailSuccessCode}
              className="w-full border border-violet-500 rounded-full h-10 px-4"
              id="email-code"
              type="text"
              placeholder="6자리 인증코드를 입력해주세요."
              onChange={handleChangeEmailCode}
            />
            <Button
              type="button"
              rounded="full"
              variant="outline"
              size="md-full"
              onClick={() => handleClickEmailSuccess(emailSuccessCode)}
            >
              인증 확인
            </Button>
          </div>
        )}

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
          className="mb-4"
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
          className="mb-4"
        />

        {/* 이름 필드 */}
        <InputField
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
          className="mb-4"
        />

        {/* 키 필드 */}
        <InputField
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
              value: /^[0-9]{2,}$/, // 숫자만, 최소 2자리 이상
              message: '숫자만 입력 가능하며 2자리 이상이어야 합니다.',
            },
          })}
          error={errors.height as FieldError}
          isDirty={dirtyFields.height}
          className="mb-4"
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
          className="mb-4"
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
          className="mb-4"
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
          className="mb-4"
        />

        {/* 지역 필드 */}
        <RegionSelector
          register={register}
          error={errors.region?.message as string}
          required
        />

        {/* 휴대폰번호 필드 */}
        <InputField
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
          className="mb-4"
        />

        {/* MBTI 필드 */}
        <MbtiSelector
          register={register}
          error={errors.mbti?.message as string}
          required
        />

        {/* 관심사 필드 */}
        <MultiToggleButtonGroup
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
        />

        {/* 이런 얘기 많이 들어요 필드 */}
        <MultiToggleButtonGroup
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
        />

        {/* 저는 이런 사람이에요 필드 */}
        <MultiToggleButtonGroup
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
        />

        {/* 프로필 이미지 필드 */}
        <div className="flex flex-col gap-2 pb-2">
          <label className="text-sm font-medium text-zinc-900">
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
        <Button
          type="submit"
          size="full"
          variant="fill"
          color="rose"
          rounded="full"
          disabled={!isValid || !isImageValid || isPending}
          isLoading={isPending}
          className="p-4"
        >
          가입완료
        </Button>
      </form>
    </div>
  );
}
