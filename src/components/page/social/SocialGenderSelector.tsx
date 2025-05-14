import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface SocialGenderSelectorProps {
  register: UseFormRegisterReturn;
  required?: boolean;
  selectedGender?: string;
  error?: string;
}

export default function SocialGenderSelector({
  register,
  required,
  selectedGender,
  error,
}: SocialGenderSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-zinc-700">
        성별
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
        <div className="relative grid grid-cols-2 gap-3 h-[46px] rounded-xl">
          {[
            {
              value: 'MALE',
              label: '남성',
              icon: (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              ),
            },
            {
              value: 'FEMALE',
              label: '여성',
              icon: (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              ),
            },
          ].map(({ value, label, icon }) => (
            <label
              key={value}
              className={`
                relative flex items-center justify-center gap-2 px-4 py-0
                h-[46px] rounded-xl cursor-pointer border font-medium
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-300/40
                hover:bg-violet-50 active:scale-95
                ${
                  selectedGender === value
                    ? 'bg-gradient-to-r from-violet-400 to-pink-300 text-white border-transparent'
                    : 'bg-white/60 text-violet-500 border-violet-200'
                }
              `}
            >
              <input
                type="radio"
                value={value}
                {...register}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm font-medium">{label}</span>
              </div>
              {selectedGender === value && (
                <div className="absolute inset-0 rounded-xl ring-2 ring-violet-500/20 pointer-events-none" />
              )}
            </label>
          ))}
        </div>
      </div>
      {error && (
        <p className="text-sm text-rose-500 mt-1 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
