'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from '@/components/common/Button';
import { useLogOutMutation } from '@/hooks/mutations/useLogOutMutation';
import { useUserDeleteMutation } from '@/hooks/mutations/useUserDeleteMutation';
import { getMyProfile } from '@/services/user';

export default function AccountInformationPage() {
  const { mutate: logout } = useLogOutMutation();
  const { mutate: userDelete } = useUserDeleteMutation();
  const [email, setEmail] = useState<string | null>(null); // 이메일 상태 추가

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getMyProfile();
      if (data) setEmail(data.email); // 이메일 저장
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
          <span className="text-gray-400">{email ?? '로딩 중...'}</span>
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
