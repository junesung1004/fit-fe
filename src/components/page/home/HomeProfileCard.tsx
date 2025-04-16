import React, { ReactNode } from 'react';

interface HomeProfileCardProps {
  backgroundImageUrl: string;
  onClick: () => void;
  children: ReactNode;
}

export default function HomeProfileCard({
  onClick,
  children,
  backgroundImageUrl,
}: HomeProfileCardProps) {
  return (
    <div
      onClick={onClick}
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      className="w-full h-[200px] flex flex-col justify-between  p-5 border border-black rounded-xl overflow-hidden bg-cover bg-center cursor-pointer"
    >
      {children}
    </div>
  );
}

function Header({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* mbti */}
      {children}
    </div>
  );
}

function Body({ children }: { children: ReactNode }) {
  return (
    <div className="mt-7">
      {/* 본문 */}
      {children}
    </div>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* 버튼 */}
      {children}
    </div>
  );
}

HomeProfileCard.Header = Header;
HomeProfileCard.Body = Body;
HomeProfileCard.Footer = Footer;
