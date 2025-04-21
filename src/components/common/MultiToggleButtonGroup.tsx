/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  FieldError,
} from 'react-hook-form';
import clsx from 'clsx';

interface Props {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  limit?: number;
  min?: number;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  trigger: UseFormTrigger<any>;
  error?: FieldError;
}

export default function MultiToggleButtonGroup({
  label,
  name,
  options,
  required = false,
  limit = 3,
  min = 1,
  register,
  setValue,
  trigger,
  error,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (item: string) => {
    let updated: string[];

    if (selected.includes(item)) {
      updated = selected.filter((i) => i !== item);
    } else {
      if (selected.length >= limit) return;
      updated = [...selected, item];
    }

    setSelected(updated);
    setValue(name, updated);
    trigger(name);
  };

  useEffect(() => {
    setValue(name, selected);
  }, [selected]);

  return (
    <div className="flex flex-col gap-2 m-2">
      <label className="text-sm font-medium text-gray-400">
        {label}{' '}
        <span className="text-xs text-gray-400">
          ({min}~{limit}개 선택)
        </span>
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => toggle(item)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm border transition-all',
              selected.includes(item)
                ? 'bg-pink-300 text-white border-pink-400'
                : 'bg-pink-100 text-pink-600 border-transparent'
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <input
        type="hidden"
        {...register(name, {
          required: required ? `${label}을(를) 선택해주세요.` : false,
          validate: (value) =>
            value.length >= min || `${min}개 이상 선택해주세요.`,
        })}
      />

      {error && <small className="text-red-400">{error.message}</small>}
    </div>
  );
}
