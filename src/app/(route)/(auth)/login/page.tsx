'use client';

import React, { useState, FormEvent } from 'react';

export default function LoginPage() {
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // 여기에 로그인 로직 추가 가능
    console.log('로그인 시도:', { emailOrId, password });
  };

  return (
    <div className="max-w-sm mx-auto mt-24 p-6 border border-gray-300 rounded-lg text-center">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="이메일 또는 아이디"
          value={emailOrId}
          onChange={(e) => setEmailOrId(e.target.value)}
          className="block w-full mb-3 p-4 text-sm border border-rose-500 rounded"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full mb-4 p-4 text-sm border border-rose-500 rounded"
        />

        <button
          type="submit"
          className="w-full py-3 mb-5 text-white text-lg font-medium bg-rose-500 rounded hover:bg-rose-600"
        >
          로그인
        </button>
      </form>

      <div className="flex justify-center flex-wrap gap-3 text-sm text-gray-500 mb-5">
        <a href="/signup" className="hover:underline">회원가입</a>
        <span>|</span>
        <a href="/find-id" className="hover:underline">아이디 찾기</a>
        <span>|</span>
        <a href="/find-password" className="hover:underline">비밀번호 찾기</a>
      </div>

      <div className="my-6 text-gray-400 text-sm">또는</div>

      {/* 네이버 로그인 버튼 */}
      <button className="flex items-center justify-center w-full py-3 mb-3 bg-[#03C75A] rounded text-white">
        <img src="/naver-logo.png" alt="Naver Login" className="h-9 object-contain" />
      </button>

      {/* 카카오 로그인 버튼 */}
      <button className="flex items-center justify-center w-full py-3 mb-3 bg-[#FEE500] rounded">
        <img src="/kakao-logo.png" alt="Kakao Login" className="h-6 object-contain" />
      </button>

      {/* 구글 로그인 버튼 */}
      <button className="w-full py-3 text-black text-lg border border-gray-300 rounded bg-white hover:bg-gray-100">
        구글 로그인
      </button>
    </div>
  );
}