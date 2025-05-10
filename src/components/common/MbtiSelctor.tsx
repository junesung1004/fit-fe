'use client';

import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import clsx from 'clsx';
import { SignUpFormValues } from '@/types/signUp.type';

interface MbtiSelectorProps {
  register: UseFormRegister<SignUpFormValues>;
  error?: string;
  required?: boolean;
}

export const MBTI = [
  'MBTI를 선택해주세요',
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

export default function MbtiSelector({
  register,
  error,
  required,
}: MbtiSelectorProps) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor="mbti" className="text-sm font-medium text-zinc-900">
        MBTI
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <select
        id="mbti"
        defaultValue=""
        {...register('mbti', {
          required: required ? 'MBTI를(을) 선택해주세요' : false,
        })}
        className={clsx(
          'px-5 py-3 rounded-full border outline-none transition-all duration-200 text-sm',
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-violet-300 focus:border-rose-500 text-gray-600'
        )}
      >
        <option value="" disabled hidden>
          MBTI를 선택해주세요
        </option>
        {MBTI.filter((el) => el !== 'MBTI를 선택해주세요').map((el, idx) => (
          <option key={idx} value={el}>
            {el}
          </option>
        ))}
      </select>
      {error && <small className="text-red-400">{error}</small>}
    </div>
  );
}
