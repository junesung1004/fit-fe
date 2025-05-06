'use client';

import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import clsx from 'clsx';
import { SignUpFormValues } from '@/types/signUp.type';

interface RegionSelectorProps {
  register: UseFormRegister<SignUpFormValues>;
  error?: string;
  required?: boolean;
}

const REGION = [
  { value: '', label: '선택하세요' },
  { value: '서울', label: '서울' },
  { value: '부산', label: '부산' },
  { value: '대구', label: '대구' },
  { value: '인천', label: '인천' },
  { value: '광주', label: '광주' },
  { value: '대전', label: '대전' },
  { value: '울산', label: '울산' },
  { value: '세종', label: '세종' },
  { value: '경기', label: '경기도' },
  { value: '강원', label: '강원도' },
  { value: '충북', label: '충청북도' },
  { value: '충남', label: '충청남도' },
  { value: '전북', label: '전라북도' },
  { value: '전남', label: '전라남도' },
  { value: '경북', label: '경상북도' },
  { value: '경남', label: '경상남도' },
  { value: '제주', label: '제주도' },
];

export default function RegionSelector({
  register,
  error,
  required,
}: RegionSelectorProps) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor="region" className="text-sm font-medium text-zinc-900">
        지역
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <select
        id="region"
        defaultValue=""
        {...register('region', {
          required: required ? '지역을 선택해주세요' : false,
        })}
        className={clsx(
          'px-5 py-3 rounded-full border outline-none transition-all duration-200 text-sm',
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-violet-300 focus:border-rose-500 text-gray-600'
        )}
      >
        {REGION.map(({ value, label }) => (
          <option key={value} value={value} disabled={!value}>
            {label}
          </option>
        ))}
      </select>
      {error && <small className="text-red-400">{error}</small>}
    </div>
  );
}
