'use client';

import Button from '@/components/common/Button';
import TagBadge from '@/components/common/TagBadge';
import { useGetChatRoomDataMutation } from '@/hooks/mutation/useChatRoomDataMutation';
import { useGetChatRoomQuery } from '@/hooks/query/useGetChatRoomQuery';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Next.js 13+에서는 'next/navigation' 씀

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
}

export default function ChatsPage() {
  const { data, isError, isPending } = useGetChatRoomQuery();
  const { mutate } = useGetChatRoomDataMutation();
  const router = useRouter();

  console.log('chatlist-data.. : ', data);

  if (isError) {
    return <div>error...</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
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

  const handleEnterChatRoom = (partnerId: string) => {
    mutate(partnerId, {
      onSuccess: (data) => {
        console.log('✅ 채팅방 입장 성공:', data);
        router.push(`/chats/${data.id}`); // 방 id로 이동
      },
      onError: (error) => {
        console.error('❌ 채팅방 입장 실패:', error);
      },
    });
  };

  return (
    <div className="w-full min-h-full flex flex-col gap-10 items-center py-6 px-5">
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
            onClick={() => handleEnterChatRoom(chatRoom.partner?.id)}
          >
            대화방 👀
          </button>
        </div>
      ))}
    </div>
  );
}
