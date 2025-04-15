import React, { ReactNode } from 'react';

interface HomeProfileCardProps {
  backgroundImageUrl: string;
  children: ReactNode;
}

export default function HomeProfileCard({
  children,
  backgroundImageUrl,
}: HomeProfileCardProps) {
  return (
    <div
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      className="w-full h-[200px] flex flex-col justify-between p-5 border border-black rounded-xl overflow-hidden bg-cover bg-center"
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
    <div className="mt-10">
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
