import Link from 'next/link';
import React, { ReactNode } from 'react';

interface NavItemProps {
  href?: string;
  children: ReactNode;
}

export default function NavItem({ href, children }: NavItemProps) {
  return (
    <li className="cursor-pointer flex flex-col justify-center w-full h-[65px] px-5 border border-black rounded-3xl transition-all hover:shadow-lg">
      {href ? <Link href={href}>{children}</Link> : <>{children}</>}
    </li>
  );
}
