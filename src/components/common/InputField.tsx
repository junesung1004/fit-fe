'use client';

import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import clsx from 'clsx'; // tailwind 조건부 스타일링에 자주 사용

interface InputFieldProps {
  id: string;
  type?: string;
  label: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  isDirty?: boolean;
  required?: boolean;
}

export default function InputField({
  id,
  type = 'text',
  label,
  placeholder = '',
  register,
  error,
  required,
  isDirty,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor={id} className="text-sm font-medium text-gray-400">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
        aria-invalid={error ? 'true' : 'false'}
        className={clsx(
          'px-5 py-2 rounded-full border transition-all duration-200 outline-none',
          {
            'border-red-400 focus:border-red-500': error,
            'border-green-500 focus:border-green-600': !error && isDirty,
            'border-violet-300 focus:border-rose-500': !error && !isDirty,
          }
        )}
      />
      {error ? (
        <small className="text-red-400">{error.message}</small>
      ) : isDirty ? (
        <small className="text-green-500">정상적으로 입력되었습니다.</small>
      ) : null}
    </div>
  );
}
