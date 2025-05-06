'use client';

import Button from '@/components/common/Button';
import TagBadge from '@/components/common/TagBadge';
import { useGetChatRoomDataMutation } from '@/hooks/mutation/useChatRoomDataMutation';
import { useGetChatRoomQuery } from '@/hooks/query/useGetChatRoomQuery';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import { useState } from 'react';

interface PartnerType {
  id: string;
  name: string;
  age: number;
  height: number;
  profileImage: string;
}

interface ChatRoomType {
  id: string;
  name: string;
  partner: PartnerType;
  userId: string;
}

interface ChatRoomResponse {
  id: string;
  name: string;
  partner: PartnerType;
  userId: string;
}

export default function ChatsPage() {
  const { data, isError, isPending } = useGetChatRoomQuery();
  const { mutate } = useGetChatRoomDataMutation();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  if (isError) {
    return (
      <div className="h-[calc(100vh-160px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-zinc-900 text-xl">
            채팅 목록을 불러오는데 실패했습니다.
          </div>
          <Button
            size="md"
            rounded="full"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            다시 시도하기
          </Button>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
        <div className="relative w-[65px] h-[65px]">
          <Image src="/icons/crying-face.png" alt="우는 아이콘" fill />
        </div>
        <span className="text-gray-400 text-2xl">채팅 목록이 없어요</span>
        <Button size="lg" rounded="full" variant="outline">
          라운드 선택하러 가기💓
        </Button>
      </div>
    );
  }

  const handleEnterChatRoom = (partnerId: string, userId: string) => {
    setError(null); // 에러 상태 초기화
    mutate(partnerId, {
      onSuccess: (data: ChatRoomResponse) => {
        router.push(`/chats/${data.id}?userId=${userId}`);
      },
      onError: (error) => {
        console.error('❌ 채팅방 입장 실패:', error);
        setError('채팅방 입장에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  return (
    <div className="w-full min-h-full flex flex-col gap-10 items-center py-6 px-5">
      {error && (
        <div className="w-full p-4 bg-red-100 border border-red-400 rounded-lg text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}
      {data.map((chatRoom: ChatRoomType) => (
        <div
          key={chatRoom.partner?.id}
          className="px-5 py-5 w-full h-auto border border-rose-500 rounded-lg flex gap-9 justify-center items-center"
        >
          {/* 프로필 이미지 */}
          <div className="relative w-[120px] h-[120px]">
            <Image
              src={chatRoom.partner?.profileImage || '/default-profile.png'}
              alt="프로필이미지"
              fill
              className="object-cover rounded-md"
              sizes="120px"
            />
          </div>

          {/* 유저 정보 */}
          <div className="flex">
            <div className="flex flex-col gap-2">
              <TagBadge>이름: {chatRoom.partner?.name}</TagBadge>
              <TagBadge>나이: {chatRoom.partner?.age}</TagBadge>
              <TagBadge>키: {chatRoom.partner?.height}</TagBadge>
            </div>
          </div>

          {/* 대화하러 가기 */}
          <button
            className="bg-slate-400 px-6 py-4 rounded-2xl text-white transition-all duration-300 hover:bg-slate-600 active:bg-slate-800"
            onClick={() =>
              handleEnterChatRoom(chatRoom.partner?.id, chatRoom.userId)
            }
          >
            대화방 👀
          </button>
        </div>
      ))}
    </div>
  );
}
