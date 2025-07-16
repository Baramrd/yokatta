'use client';

import { useState, useEffect } from 'react';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  // Load bookmarks from localStorage on initial render
  useEffect(() => {
    const storedBookmarks = localStorage.getItem('yokatta-bookmarks');
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, []);

  const isBookmarked = (mangaId: number) => bookmarks.includes(mangaId);

  const toggleBookmark = (mangaId: number) => {
    let updatedBookmarks;
    if (isBookmarked(mangaId)) {
      updatedBookmarks = bookmarks.filter((id) => id !== mangaId);
    } else {
      updatedBookmarks = [...bookmarks, mangaId];
    }
    setBookmarks(updatedBookmarks);
    localStorage.setItem('yokatta-bookmarks', JSON.stringify(updatedBookmarks));
  };
  
  return { bookmarks, isBookmarked, toggleBookmark };
}