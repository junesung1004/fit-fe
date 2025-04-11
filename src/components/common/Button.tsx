'use client';

import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg' | 'full';
  variant?: 'fill' | 'outline';
  color?: 'rose' | 'violet';
  children: React.ReactNode;
}

export default function Button({
  size = 'sm',
  variant = 'fill',
  color = 'rose',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-md text-sm font-medium transition-all duration-300',

        //사이즈
        size === 'sm' && 'w-[60px] h-8',
        size === 'md' && 'w-[130px] h-8',
        size === 'lg' && 'w-[270px] h-8',
        size === 'full' && 'w-full h-8',

        // 스타일 및 컬러
        variant === 'fill' &&
          color === 'rose' &&
          'bg-rose-500 text-white hover:bg-rose-700',
        variant === 'fill' &&
          color === 'violet' &&
          'bg-violet-500 text-white hover:bg-violet-700',
        variant === 'outline' &&
          color === 'rose' &&
          'border border-rose-500 text-rose-500 bg-white hover:border-rose-700 hover:text-rose-700',
        variant === 'outline' &&
          color === 'violet' &&
          'border border-violet-500 text-violet-500 bg-white hover:border-violet-700 hover:text-violet-700'
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
