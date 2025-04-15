import React, { ReactNode } from 'react';

export default function Mbti({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center tracking-widest w-[64px] h-[25px] bg-[rgba(0,0,0,0.5)] text-white rounded-full">
      {children}
    </div>
  );
}
