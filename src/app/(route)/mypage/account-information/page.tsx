'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from '@/components/common/Button';
import { useLogOutMutation } from '@/hooks/mutations/useLogOutMutation';
import { useUserDeleteMutation } from '@/hooks/mutations/useUserDeleteMutation';
import { getMyProfile } from '@/services/user';
import Spinner from '@/components/common/Spinner';

export default function AccountInformationPage() {
  const { mutate: logout } = useLogOutMutation();
  const { mutate: userDelete } = useUserDeleteMutation();
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data = await getMyProfile();
        if (data) setEmail(data.email);
      } catch {
        console.error('프로필을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleDeleteAccount = () => {
    userDelete();
  };

  const handleClickLogout = () => {
    logout();
  };

  return (
    <div className="w-full min-h-full flex flex-col justify-between gap-10 px-16  py-10">
      <div>
        <h1 className="text-3xl mb-3">계정</h1>
        <div className="mb-10  w-full px-5 py-4 border border-black rounded-2xl flex gap-6  items-center">
          <span>이메일</span>
          {isLoading ? (
            <Spinner size="sm" color="secondary" />
          ) : (
            <span className="text-gray-400">{email}</span>
          )}
        </div>

        <h1 className="text-3xl mb-3">계정 관리</h1>
        <div
          onClick={handleClickLogout}
          className="cursor-pointer w-full px-5 py-4 border border-black rounded-2xl flex justify-between items-center hover:shadow-lg"
        >
          <span>로그아웃하기</span>
          <ChevronRightIcon className="w-6 h-6" />
        </div>
      </div>

      <Button
        variant="outline"
        size="full"
        color="violet"
        onClick={handleDeleteAccount}
      >
        회원 탈퇴
      </Button>
    </div>
  );
}
