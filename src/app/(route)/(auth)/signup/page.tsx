'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SignupPage() {
  const [gender, setGender] = useState<'남자' | '여자' | ''>('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 입력값 유효성 검사나 저장 로직이 있다면 여기에 작성
    router.push('signup/profilepage'); // 원하는 경로로 이동
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-10">
      <form className="space-y-2" onSubmit={handleSubmit}>
        <Input label="이메일" type="email" />
        <Input label="비밀번호" type="password" />
        <Input label="비밀번호 확인" type="password" />
        <Input label="이름" />

        {/* 성별 */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">성별</label>
          <div className="flex gap-2">
            <GenderButton selected={gender === '남자'} onClick={() => setGender('남자')} label="남자" />
            <GenderButton selected={gender === '여자'} onClick={() => setGender('여자')} label="여자" />
          </div>
        </div>

        {/* 닉네임, 생년월일 */}
        <Input label="닉네임" />
        <Input label="생년월일" placeholder="YYYY-MM-DD" />

        {/* 주소 */}
        <div className="relative">
          <Input label="주소" />
          <MagnifyingGlassIcon className="w-4 h-4 absolute top-8 right-3 text-rose-500" />
        </div>

        {/* 휴대폰번호 */}
        <Input label="휴대폰번호" />

        {/* 다음 버튼 */}
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-rose-500 text-white rounded-full shadow hover:bg-rose-600 text-sm"
        >
          다음
        </button>
      </form>
    </div>
  );
}

type InputProps = {
  label: string;
  type?: string;
  placeholder?: string;
};

function Input({ label, type = 'text', placeholder }: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-rose-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-300"
      />
    </div>
  );
}

type GenderButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function GenderButton({ label, selected, onClick }: GenderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-1.5 px-3 rounded-full border text-sm ${
        selected ? 'bg-rose-500 text-white' : 'border-rose-400 text-rose-500'
      }`}
    >
      {label}
    </button>
  );
}
