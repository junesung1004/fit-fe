import Image from 'next/image';

interface MessageProps {
  text: string;
  isMine: boolean;
  showAvatar?: boolean; // optional (내 메시지는 생략 가능하니까)
}

export const Message = ({ text, isMine, showAvatar }: MessageProps) => (
  <div className={`flex ${isMine ? 'justify-end' : 'gap-2'}`}>
    {!isMine && showAvatar && (
      <div className="relative w-[40px] h-[40px]">
        <Image
          src="/june.jpg"
          alt="프로필 이미지"
          fill
          className="object-cover rounded-full"
        />
      </div>
    )}
    <div
      className={`px-4 py-2 rounded-lg ${
        isMine ? 'bg-[#F2DC01] self-end' : 'bg-white'
      }`}
    >
      {text}
    </div>
  </div>
);
