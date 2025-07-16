'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function PaginationControls({ hasNextPage, hasPrevPage }: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? '1';

  const handleNavigation = (direction: 'next' | 'prev') => {
    // Buat salinan dari parameter URL yang ada saat ini (seperti genre, query pencarian, dll.)
    const params = new URLSearchParams(searchParams);
    
    // Setel nomor halaman yang baru
    const newPage = direction === 'next' ? Number(page) + 1 : Number(page) - 1;
    params.set('page', String(newPage));
    
    // Dorong ke URL baru dengan semua parameter yang tersimpan
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-center items-center gap-4 my-8">
      <button
        disabled={!hasPrevPage}
        onClick={() => handleNavigation('prev')}
        className="bg-accent hover:bg-highlight text-white font-bold py-2 px-4 rounded disabled:bg-secondary disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <div className="text-primary font-semibold">
        Page {page}
      </div>

      <button
        disabled={!hasNextPage}
        onClick={() => handleNavigation('next')}
        className="bg-accent hover:bg-highlight text-white font-bold py-2 px-4 rounded disabled:bg-secondary disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}