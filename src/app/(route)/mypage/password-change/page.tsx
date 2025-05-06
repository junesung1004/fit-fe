'use client';

import React, { useState } from 'react';
import Button from '@/components/common/Button';
import { EyeIcon } from '@heroicons/react/24/solid';
import { changePassword } from '@/services/user'; // ✅ API 함수 import

export default function PasswordChangePage() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChangePasswordState = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: 'current' | 'new' | 'confirm'
  ) => {
    e.preventDefault();
    setPasswords((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleChangePasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      alert('신규 비밀번호가 일치하지 않습니다.');
      return;
    }

    const success = await changePassword(
      passwords.current,
      passwords.new,
      passwords.confirm
    );

    if (success) {
      alert('비밀번호가 성공적으로 변경되었습니다.');
      // 변경 후 비밀번호 초기화
      setPasswords({
        current: '',
        new: '',
        confirm: '',
      });
    } else {
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <main className="w-full h-[calc(100vh-160px)] py-8 px-8 md:px-6 lg:px-8 flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        <form
          className="flex flex-col gap-8 md:gap-12"
          onSubmit={handleChangePasswordSubmit}
        >
          {/* 현재 비밀번호 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password-origin"
              className="text-2xl md:text-3xl cursor-pointer"
            >
              현재 비밀번호
            </label>
            <div className="flex justify-between items-center py-3 px-4 md:px-7 border border-black rounded-xl">
              <input
                className="w-3/4 h-8"
                id="password-origin"
                name="password-origin"
                type={showPassword.current ? 'text' : 'password'}
                placeholder="현재 비밀번호 입력"
                value={passwords.current}
                onChange={(e) => handleChangePasswordState(e, 'current')}
              />
              <EyeIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
              />
            </div>
          </div>

          {/* 신규 비밀번호 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password-new"
              className="text-2xl md:text-3xl cursor-pointer"
            >
              신규 비밀번호
            </label>
            <div className="flex justify-between items-center py-3 px-4 md:px-7 border border-black rounded-xl">
              <input
                className="w-3/4 h-8"
                id="password-new"
                name="password-new"
                type={showPassword.new ? 'text' : 'password'}
                placeholder="신규 비밀번호 입력"
                value={passwords.new}
                onChange={(e) => handleChangePasswordState(e, 'new')}
              />
              <EyeIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    new: !prev.new,
                  }))
                }
              />
            </div>

            <div className="flex justify-between items-center py-3 px-4 md:px-7 border border-black rounded-xl">
              <input
                className="w-3/4 h-8"
                id="password-new-confirm"
                name="password-new-confirm"
                type={showPassword.confirm ? 'text' : 'password'}
                placeholder="신규 비밀번호 확인"
                value={passwords.confirm}
                onChange={(e) => handleChangePasswordState(e, 'confirm')}
              />
              <EyeIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Button
              rounded="lg"
              variant="outline"
              size="full"
              color="violet"
              type="submit"
            >
              비밀번호 변경
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
