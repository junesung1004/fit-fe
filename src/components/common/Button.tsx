import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'md-full' | 'lg-24' | 'lg' | 'lg-full' | 'full';
  variant?: 'fill' | 'outline';
  color?: 'rose' | 'violet' | 'cyan';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export default function Button({
  size = 'sm',
  variant = 'fill',
  color = 'rose',
  rounded = 'sm',
  className,
  isLoading = false,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'font-medium transition-all duration-300 relative',

        // 둥근 정도 설정
        rounded === 'sm' && 'rounded-sm',
        rounded === 'md' && 'rounded-md',
        rounded === 'lg' && 'rounded-xl',
        rounded === 'full' && 'rounded-full',

        //사이즈
        size === 'sm' && 'w-[70px] h-10 text-sm',
        size === 'md' && 'w-[150px] h-10 text-sm',
        size === 'md-full' && 'w-full h-10 text-sm',
        size === 'lg-24' && 'w-24 h-12 text-base',
        size === 'lg' && 'w-[300px] h-12 text-base',
        size === 'lg-full' && 'w-full h-12 text-base',
        size === 'full' && 'w-full h-12 text-lg',

        // 스타일 및 컬러
        variant === 'fill' &&
          color === 'rose' &&
          'bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700',
        variant === 'fill' &&
          color === 'violet' &&
          'bg-violet-500 text-white hover:bg-violet-600 active:bg-violet-700',
        variant === 'fill' &&
          color === 'cyan' &&
          'bg-cyan-500 text-white hover:bg-cyan-600 active:bg-cyan-700',
        variant === 'outline' &&
          color === 'rose' &&
          'border border-rose-500 text-rose-500 bg-[rgba(255,255,255,0.1)] hover:bg-rose-600 hover:text-white active:bg-rose-700',
        variant === 'outline' &&
          color === 'violet' &&
          'border border-violet-500 text-violet-500 bg-[rgba(255,255,255,0.1)] hover:bg-violet-600 hover:text-white active:bg-violet-700',

        // disabled 상태
        disabled &&
          'bg-gray-300 cursor-not-allowed opacity-50 hover:bg-gray-300',

        // 커스텀 클래스
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      <span className={clsx(isLoading && 'invisible')}>{children}</span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}
