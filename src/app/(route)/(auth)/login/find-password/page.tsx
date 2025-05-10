'use client';

import Button from '@/components/common/Button';
import {
  useChangePasswordMutation,
  useFindPasswordMutation,
} from '@/hooks/mutations/useFindPasswordMutation';

import { ChangeEvent, useState } from 'react';

export default function PasswordFindPage() {
  const [isSuccessPassword, setIsSuccessPassword] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  console.log('userId : ', userId);
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const { mutate: findPassword } = useFindPasswordMutation((userId: string) => {
    setIsSuccessPassword(true);
    setUserId(userId);
  });

  const { mutate: changePassword } = useChangePasswordMutation();

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleChangePasswordConfirm = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleClickFindPassword = (e: React.FormEvent) => {
    e.preventDefault();

    findPassword({ email, name, phone });
  };

  const handleClickChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    changePassword({ userId: userId, newPassword, confirmPassword });
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-sm w-full p-6 border border-gray-300 rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-6">비밀번호 찾기</h1>

        <form onSubmit={handleClickFindPassword}>
          <input
            type="email"
            value={email}
            onChange={handleChangeEmail}
            placeholder="이메일을 입력해주세요"
            className="block w-full mb-2 p-4 text-sm border border-rose-500 rounded"
          />
          <input
            type="text"
            value={name}
            onChange={handleChangeName}
            placeholder="이름을 입력해주세요"
            className="block w-full mb-2 p-4 text-sm border border-rose-500 rounded"
          />
          <input
            type="text"
            value={phone}
            onChange={handleChangePhone}
            placeholder="전화번호를 입력해주세요"
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
            비밀번호 찾기
          </Button>
        </form>

        {isSuccessPassword && (
          <div className="flex flex-col gap-2 max-w-sm w-full">
            <form
              onSubmit={handleClickChangePassword}
              className="flex flex-col gap-2"
            >
              <label
                htmlFor="new-password"
                className="text-sm font-medium text-zinc-800"
              >
                새로운 비밀번호
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={handleChangePassword}
                placeholder="새 비밀번호를 입력해주세요"
                className="w-full px-4 py-3 border border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm placeholder-gray-400"
              />

              {/* 비밀번호 확인인 */}
              <label
                htmlFor="new-password-confirm"
                className="text-sm font-medium text-zinc-800"
              >
                비밀번호 확인
              </label>
              <input
                id="new-password-confirm"
                type="password"
                value={confirmPassword}
                onChange={handleChangePasswordConfirm}
                placeholder="비밀번호를 다시 한번 입력해주세요"
                className="w-full px-4 py-3 border border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm placeholder-gray-400"
              />
              <Button
                type="submit"
                size="full"
                variant="fill"
                color="rose"
                rounded="md"
                className="mb-4"
              >
                비밀번호 변경
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
