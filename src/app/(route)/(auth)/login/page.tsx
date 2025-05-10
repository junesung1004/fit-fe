'use client';

import React, { FormEvent, useRef } from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import { useLoginMutation } from '@/hooks/mutations/useLoginMutation';
import { LoginProps } from '@/services/login';

export default function LoginPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { mutate } = useLoginMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value ?? '';
    const password = passwordRef.current?.value ?? '';

    const loginData: LoginProps = {
      email,
      password,
    };

    try {
      mutate(loginData);
    } catch (error) {
      console.log('로그인 기능 에러 : ', error);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-sm w-full p-6 border border-gray-300 rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-6">로그인</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="이메일 또는 아이디"
            ref={emailRef}
            className="block w-full mb-2 p-4 text-sm border border-rose-500 rounded"
          />
          <input
            type="password"
            placeholder="비밀번호"
            ref={passwordRef}
            className="block w-full mb-4 p-4 text-sm border border-rose-500 rounded"
          />

          <Button
            type="submit"
            size="full"
            variant="fill"
            color="rose"
            rounded="md"
            className="mb-4"
          >
            로그인
          </Button>
        </form>

        <div className="flex justify-center flex-wrap gap-3 text-sm text-gray-500 mb-5">
          <a href="/signup" className="hover:underline">
            회원가입
          </a>
          <span>|</span>
          <a href="/login/find-email" className="hover:underline">
            이메일 찾기
          </a>
          <span>|</span>
          <a href="/login/find-password" className="hover:underline">
            비밀번호 찾기
          </a>
        </div>

        <div className="my-6 text-gray-400 text-sm">또는</div>

        <div className="space-y-3">
          {/* 네이버 로그인 */}
          <button className="flex items-center justify-center w-full py-3 bg-[#03C75A] rounded text-white">
            <div className="relative w-6 h-6 mr-2">
              <Image
                src="/naver-logo.png"
                alt="Naver"
                fill
                className="object-contain"
              />
            </div>
          </button>

          {/* 카카오 로그인 */}
          <button className="flex items-center justify-center w-full py-3 bg-[#FEE500] rounded text-black">
            <div className="relative w-6 h-6 mr-2">
              <Image
                src="/kakao-logo.png"
                alt="Kakao"
                fill
                className="object-contain"
              />
            </div>
          </button>

          {/* 구글 로그인 */}
          <button className="flex items-center justify-center w-full py-3 border border-gray-300 rounded bg-white hover:bg-gray-100">
            <div className="relative w-6 h-6 mr-2">
              <Image
                src="/google-logo.png"
                alt="Google"
                fill
                className="object-contain"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
