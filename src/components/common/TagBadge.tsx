import React, { ReactNode } from 'react';

export default function TagBadge({ children }: { children: ReactNode }) {
  return (
    <p className="inline-block bg-gray-200 px-3 py-2 text-violet-500 rounded-lg">
      {children}
    </p>
  );
}
