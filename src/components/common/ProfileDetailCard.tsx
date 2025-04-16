import React, { ReactNode } from 'react';

export default function MemberProfileDetailCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="w-full h-full flex flex-col gap-5 py-5  px-2 xs:px-5 bg-green-100 rounded-xl">
      {children}
    </div>
  );
}

function Image({ children }: { children: ReactNode }) {
  return <div className="relative w-full h-[250px]">{children}</div>;
}

function Information({ children }: { children: ReactNode }) {
  return <div className="text-slate-500 flex flex-col gap-1">{children}</div>;
}

function LikeCountBadge({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center gap-4 text-3xl">
      {children}
    </div>
  );
}

function AboutMe({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>;
}

MemberProfileDetailCard.Image = Image;
MemberProfileDetailCard.Information = Information;
MemberProfileDetailCard.LikeCountBadge = LikeCountBadge;
MemberProfileDetailCard.AboutMe = AboutMe;
