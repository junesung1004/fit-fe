import Image from 'next/image';
import { MessageProps } from '@/types/chats.type';

export const Message = ({ message, isMine }: MessageProps) => {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      {!isMine && (
        <div className="flex items-end mr-2">
          <Image
            src={message.profileImage || '/default-profile.png'}
            alt="프로필"
            width={50}
            height={50}
            className="rounded-full object-cover w-12 h-12"
          />
        </div>
      )}
      <div className="flex flex-col max-w-[70%]">
        {!isMine && (
          <span className="text-sm text-gray-600 mb-1">
            {message.name || '알 수 없음'}
          </span>
        )}
        <div className="flex items-end gap-2">
          {isMine && (
            <span className="text-xs text-gray-500">
              {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
            </span>
          )}
          <div
            className={`rounded-lg px-3 py-2 ${
              isMine ? 'bg-violet-500 text-white' : 'bg-white'
            }`}
          >
            {message.content}
          </div>
          {!isMine && (
            <span className="text-xs text-gray-500">
              {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
