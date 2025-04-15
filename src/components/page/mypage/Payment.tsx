import React, { ReactNode } from 'react';

interface NavItemProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function Payment({ children, onClick }: NavItemProps) {
  return (
    <li
      onClick={onClick}
      className="relative cursor-pointer flex flex-col justify-center w-full h-[40px] transition-all group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-violet-500 transition-all duration-300 group-hover:w-full"></span>
    </li>
  );
}
