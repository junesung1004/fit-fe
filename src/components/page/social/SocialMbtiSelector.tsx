'use client';

import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { SignUpFormValues } from '@/types/signUp.type';

interface MbtiSelectorProps {
  register: UseFormRegister<SignUpFormValues>;
  error?: string;
  required?: boolean;
}

const MBTI_OPTIONS = [
  { value: '', label: 'MBTI를 선택해주세요', description: '' },
  { value: 'ISTJ', label: 'ISTJ', description: '청렴결백한 논리주의자' },
  { value: 'ISFJ', label: 'ISFJ', description: '용감한 수호자' },
  { value: 'INFJ', label: 'INFJ', description: '선의의 옹호자' },
  { value: 'INTJ', label: 'INTJ', description: '용의주도한 전략가' },
  { value: 'ISTP', label: 'ISTP', description: '만능 재주꾼' },
  { value: 'ISFP', label: 'ISFP', description: '호기심 많은 예술가' },
  { value: 'INFP', label: 'INFP', description: '열정적인 중재자' },
  { value: 'INTP', label: 'INTP', description: '논리적인 사색가' },
  { value: 'ESTP', label: 'ESTP', description: '모험을 즐기는 사업가' },
  { value: 'ESFP', label: 'ESFP', description: '자유로운 영혼의 연예인' },
  { value: 'ENFP', label: 'ENFP', description: '재기발랄한 활동가' },
  { value: 'ENTP', label: 'ENTP', description: '논쟁을 즐기는 변론가' },
  { value: 'ESTJ', label: 'ESTJ', description: '엄격한 관리자' },
  { value: 'ESFJ', label: 'ESFJ', description: '사교적인 외교관' },
  { value: 'ENFJ', label: 'ENFJ', description: '정의로운 사회운동가' },
  { value: 'ENTJ', label: 'ENTJ', description: '대담한 통솔자' },
];

export default function SocialMbtiSelector({
  register,
  error,
  required,
}: MbtiSelectorProps) {
  return (
    <div className="flex flex-col gap-2 w-full col-span-2">
      <label htmlFor="mbti" className="text-sm font-medium text-zinc-700">
        MBTI
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <div className="relative group w-[420px] max-w-full mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-rose-500/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300 w-full h-full" />
        <div className="relative w-full">
          <select
            id="mbti"
            defaultValue=""
            {...register('mbti', {
              required: required ? 'MBTI를(을) 선택해주세요' : false,
            })}
            className={`
              w-[420px] max-w-full mx-auto px-4 py-3
              bg-white/80 backdrop-blur-sm
              border rounded-xl
              text-sm text-zinc-900
              placeholder:text-zinc-400
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-violet-500/30
              transition-all duration-300
              appearance-none
              pr-10
              ${
                error
                  ? 'border-rose-500/50 focus:border-rose-500'
                  : 'border-zinc-200/50 group-hover:border-violet-500/50 focus:border-violet-500'
              }
            `}
          >
            {MBTI_OPTIONS.map(({ value, label, description }) => (
              <option
                key={value}
                value={value}
                disabled={!value}
                className="text-zinc-900 py-2"
              >
                {value ? `${label} - ${description}` : label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
      {error && (
        <p className="text-sm text-rose-500 mt-1 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
