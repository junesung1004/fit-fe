import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  isDirty?: boolean;
  register?: UseFormRegisterReturn;
}

export default function SocialInput({
  label,
  error,
  isDirty,
  register,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-zinc-700">
        {label}
        {props.required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-rose-500/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
        <input
          {...register}
          {...props}
          className={`
            relative w-full px-4 py-3
            bg-white/80 backdrop-blur-sm
            border rounded-xl
            text-sm text-zinc-900
            placeholder:text-zinc-400
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-violet-500/30
            transition-all duration-300
            ${
              error
                ? 'border-rose-500/50 focus:border-rose-500'
                : 'border-zinc-200/50 group-hover:border-violet-500/50 focus:border-violet-500'
            }
            ${isDirty && !error ? 'border-emerald-500/50 focus:border-emerald-500' : ''}
            ${className}
          `}
        />
        {isDirty && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-fade-in">
            <svg
              className="w-5 h-5 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-shake">
            <svg
              className="w-5 h-5 text-rose-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-rose-500 mt-1 animate-fade-in">
          {error.message}
        </p>
      )}
    </div>
  );
}
