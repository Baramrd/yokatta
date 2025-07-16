'use client';

import { useState, useEffect } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import { Manga } from '../types';
import MangaCard from '../components/MangaCard';
import Link from 'next/link';

export default function BookmarksPage() {
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [bookmarkedManga, setBookmarkedManga] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Only fetch if there are bookmarks
    if (bookmarks.length > 0) {
      // Fetch details for all bookmarked manga in parallel
      Promise.all(
        bookmarks.map((id) =>
          fetch(`https://api.jikan.moe/v4/manga/${id}`)
            .then((res) => res.json())
            .then((data) => data.data)
        )
      )
      .then((results) => {
        // Filter out any null results in case an ID failed
        setBookmarkedManga(results.filter(Boolean));
        setIsLoading(false);
      });
    } else {
      setBookmarkedManga([]); // Clear list if no bookmarks
      setIsLoading(false);
    }
  }, [bookmarks]);

  if (isLoading) {
    return <div className="text-center p-10">Loading Bookmarks...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold border-b border-secondary pb-4 mb-8">
        My Bookmarks
      </h1>
      {bookmarkedManga.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {bookmarkedManga.map((manga) => (
            <div key={manga.mal_id} className="relative">
              <MangaCard manga={manga} />
              <button
                onClick={() => toggleBookmark(manga.mal_id)}
                className="absolute top-2 right-2 bg-highlight text-white rounded-full p-2 text-xs font-bold leading-none"
                aria-label="Remove bookmark"
              >
                X
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">
          <p>You have no bookmarked manga.</p>
          <Link href="/" className="text-highlight hover:underline mt-4 inline-block">
            Find some manga to read!
          </Link>
        </div>
      )}
    </div>
  );
}