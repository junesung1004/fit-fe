'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { SocialMultiToggleButtonGroupProps } from '@/types/social.type';
import Spinner from '@/components/common/Spinner';

export default function SocialMultiToggleButtonGroup({
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
  gridCols = 'grid-cols-3',
  isLoading = false,
}: SocialMultiToggleButtonGroupProps) {
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
  }, [selected, name, setValue]);

  return (
    <div className="flex flex-col gap-2 my-2">
      <label className="text-sm font-semibold text-zinc-800 mb-1">
        {label}{' '}
        <span className="text-xs text-zinc-500 font-normal">
          ({min}~{limit}개 선택)
        </span>
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[100px]">
          <Spinner size="md" color="primary" />
        </div>
      ) : (
        <div className={`grid ${gridCols} gap-2`}>
          {options.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              className={clsx(
                'px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-300/40',
                'hover:scale-105 active:scale-95',
                selected.includes(item)
                  ? 'bg-gradient-to-r from-violet-400 to-pink-300 text-white shadow-lg border-transparent'
                  : 'bg-white/60 text-violet-500 border-violet-200 hover:bg-violet-50'
              )}
              aria-pressed={selected.includes(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <input
        type="hidden"
        {...register(name, {
          required: required ? `${label}을(를) 선택해주세요.` : false,
          validate: (value: unknown) =>
            (Array.isArray(value) && value.length >= min) ||
            `${min}개 이상 선택해주세요.`,
        })}
      />

      {error && (
        <small className="text-rose-500 mt-1 animate-fade-in block font-medium">
          {error.message}
        </small>
      )}
    </div>
  );
}
