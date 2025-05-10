'use client';

import Button from '@/components/common/Button';
import { useFindEmailMutation } from '@/hooks/mutations/useFindEmailMutation';

import Link from 'next/link';
import { ChangeEvent, useState } from 'react';

export default function EmailFindPage() {
  const [isSuccessEmail, setIsSuccessEmail] = useState(false);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  console.log('email', email);

  const { mutate: findEmail } = useFindEmailMutation((email: string) => {
    setEmail(email);
    setIsSuccessEmail(true);
  });

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleClickFindEmail = (e: React.FormEvent) => {
    e.preventDefault();

    findEmail({ name, phone });
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-sm w-full p-6 border border-gray-300 rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-6">이메일 찾기</h1>

        <form onSubmit={handleClickFindEmail}>
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
            이메일 찾기
          </Button>
        </form>

        {isSuccessEmail && (
          <div className="flex flex-col gap-5">
            <div className="w-full max-w-md mx-auto border border-violet-300 bg-violet-50 rounded-2xl p-6 shadow-md">
              <h2 className="text-sm font-semibold text-violet-600 mb-1">
                사용하신 이메일
              </h2>
              <p className="text-lg font-medium text-gray-800">{email}</p>
            </div>

            <Link className="text-rose-300 hover:text-rose-600" href={'/login'}>
              로그인 하러가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
