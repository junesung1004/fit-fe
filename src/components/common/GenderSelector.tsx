'use client';

import React from 'react';
import clsx from 'clsx';
import { UseFormRegister } from 'react-hook-form';

interface GenderSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  selectedGender?: string;
  error?: string;
  required?: boolean;
}

export default function GenderSelector({
  register,
  selectedGender,
  error,
  required,
}: GenderSelectorProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-sm font-medium text-zinc-900">
        성별
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="flex gap-4">
        {[
          { value: 'male', label: '남자' },
          { value: 'female', label: '여자' },
        ].map(({ value, label }) => (
          <label
            key={value}
            className={clsx(
              'w-full text-center px-6 py-2 border rounded-full cursor-pointer text-sm transition-all',
              selectedGender === value
                ? 'border-green-500 text-green-600 font-semibold'
                : 'border-gray-300 text-gray-500'
            )}
          >
            <input
              type="radio"
              value={value}
              {...register('gender', {
                required: '성별을 선택해주세요.',
              })}
              className="hidden"
            />
            {label}
          </label>
        ))}
      </div>
      {error && <small className="text-red-400">{error}</small>}
    </div>
  );
}
