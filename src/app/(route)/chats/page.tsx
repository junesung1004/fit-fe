'use client';

import Button from '@/components/common/Button';
import TagBadge from '@/components/common/TagBadge';
import { useGetChatRoomDataMutation } from '@/hooks/mutations/useChatRoomDataMutation';
import { useGetChatRoomQuery } from '@/hooks/queries/useGetChatRoomQuery';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import { ChatRoomType, ChatRoomResponse } from '@/types/chats.type';
import { isAxiosError } from '@/lib/error';
import { toast } from 'react-toastify';

export default function ChatsPage() {
  const { data, isError, isPending } = useGetChatRoomQuery();
  const { mutate } = useGetChatRoomDataMutation();
  const router = useRouter();

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
      <div className="w-full h-[calc(100vh-160px)] flex items-center justify-center">
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
    mutate(partnerId, {
      onSuccess: (data: ChatRoomResponse) => {
        router.push(`/chats/${data.id}?userId=${userId}`);
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage || '채팅방 입장에 실패했습니다.');
        } else {
          toast.error('채팅방 입장에 실패했습니다.');
        }
      },
    });
  };

  return (
    <div className="w-full min-h-full flex flex-col gap-10 items-center py-6 px-5">
      {data.map((chatRoom: ChatRoomType) => (
        <div
          key={chatRoom.partner?.id}
          className="px-5 py-5 w-full h-auto bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex gap-10 justify-center items-center"
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
          <Button
            size="lg-24"
            color="violet"
            rounded="lg"
            className="py-4"
            onClick={() =>
              handleEnterChatRoom(chatRoom.partner?.id, chatRoom.userId)
            }
          >
            대화방 👀
          </Button>
        </div>
      ))}
    </div>
  );
}
