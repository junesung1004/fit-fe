import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg' | 'full';
  variant?: 'fill' | 'outline';
  color?: 'rose' | 'violet';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
}

export default function Button({
  size = 'sm',
  variant = 'fill',
  color = 'rose',
  rounded = 'sm',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'text-sm font-medium transition-all duration-300',

        // 둥근 정도 설정
        rounded === 'sm' && 'rounded-sm',
        rounded === 'md' && 'rounded-md',
        rounded === 'lg' && 'rounded-xl',
        rounded === 'full' && 'rounded-full',

        //사이즈
        size === 'sm' && 'w-[60px] h-10',
        size === 'md' && 'w-[130px] h-8',
        size === 'lg' && 'w-[270px] h-8',
        size === 'full' && 'w-full h-10',

        // 스타일 및 컬러
        variant === 'fill' &&
          color === 'rose' &&
          'bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700',
        variant === 'fill' &&
          color === 'violet' &&
          'bg-violet-500 text-white hover:bg-violet-600 active:bg-rose-700',
        variant === 'outline' &&
          color === 'rose' &&
          'border border-rose-500 text-rose-500 bg-[rgba(255,255,255,0.1)] hover:bg-rose-600 hover:text-white active:bg-rose-700',
        variant === 'outline' &&
          color === 'violet' &&
          'border border-violet-500 text-violet-500 bg-[rgba(255,255,255,0.1)] hover:bg-violet-600 hover:text-white active:bg-violet-700'
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
