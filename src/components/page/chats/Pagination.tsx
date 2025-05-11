'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  pageButtonLimit?: number;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  pageButtonLimit = 5,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentGroup = Math.floor((currentPage - 1) / pageButtonLimit);
  const startPage = currentGroup * pageButtonLimit + 1;
  const endPage = Math.min(startPage + pageButtonLimit - 1, totalPages);

  const handlePrevPageGroup = () => {
    if (startPage !== 1) {
      onPageChange(startPage - 1);
    }
  };

  const handleNextPageGroup = () => {
    if (endPage !== totalPages) {
      onPageChange(endPage + 1);
    }
  };

  if (totalItems === 0) return null;

  return (
    <div className="flex gap-2 mt-8 justify-center">
      <button
        className={`px-3 py-1 rounded transition-colors duration-150 ${
          startPage === 1
            ? 'bg-transparent text-gray-300 cursor-not-allowed'
            : 'bg-transparent text-gray-500 hover:bg-violet-100 hover:text-violet-600'
        }`}
        onClick={handlePrevPageGroup}
        disabled={startPage === 1}
        aria-label="이전 페이지 그룹"
      >
        &lt;
      </button>
      {Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      ).map((num) => (
        <button
          key={num}
          className={`px-3 py-1 rounded ${
            currentPage === num
              ? 'bg-violet-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-violet-100 hover:text-violet-600'
          }`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}
      <button
        className={`px-3 py-1 rounded transition-colors duration-150 ${
          endPage === totalPages
            ? 'bg-transparent text-gray-300 cursor-not-allowed'
            : 'bg-transparent text-gray-500 hover:bg-violet-100 hover:text-violet-600'
        }`}
        onClick={handleNextPageGroup}
        disabled={endPage === totalPages}
        aria-label="다음 페이지 그룹"
      >
        &gt;
      </button>
    </div>
  );
}
