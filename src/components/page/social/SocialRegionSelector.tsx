'use client';

import { SocialRegionSelectorProps } from '@/types/social.type';

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

export default function SocialRegionSelector({
  register,
  error,
  required,
}: SocialRegionSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="region" className="text-sm font-medium text-zinc-700">
        지역
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-rose-500/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
        <div className="relative">
          <select
            id="region"
            defaultValue=""
            {...register('region', {
              required: required ? '지역을 선택해주세요' : false,
            })}
            className={`
              w-full px-4 py-3
              bg-white/80 backdrop-blur-sm
              border rounded-xl
              text-sm text-zinc-900
              placeholder:text-zinc-400
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-violet-500/30
              transition-all duration-300
              appearance-none
              ${
                error
                  ? 'border-rose-500/50 focus:border-rose-500'
                  : 'border-zinc-200/50 group-hover:border-violet-500/50 focus:border-violet-500'
              }
            `}
          >
            {REGION.map(({ value, label }) => (
              <option
                key={value}
                value={value}
                disabled={!value}
                className="text-zinc-900"
              >
                {label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
      {error && (
        <p className="text-sm text-rose-500 mt-1 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
