'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Manga, Genre } from '@/app/types';
import { useBookmarks } from '@/app/hooks/useBookmarks';

// --- PERBAIKAN FINAL DI SINI ---
// Kita mendefinisikan PageProps agar sesuai persis dengan apa yang diharapkan Next.js,
// yaitu dengan menyertakan 'params' dan 'searchParams', meskipun kita tidak menggunakan searchParams.
interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
// --- AKHIR DARI PERBAIKAN ---

export default function MangaDetailPage({ params }: PageProps) { // <-- Tetap gunakan PageProps di sini
  const [manga, setManga] = useState<Manga | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const mangaId = parseInt(params.id);

  const chapterCount = manga?.chapters || 0;
  const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const mangaRes = await fetch(`https://api.jikan.moe/v4/manga/${params.id}`);
        if (mangaRes.ok) {
          const mangaData = await mangaRes.json();
          setManga(mangaData.data);
        } else {
          setManga(null);
        }
      } catch (error) {
        console.error("Failed to fetch manga details:", error);
        setManga(null);
      }
      setIsLoading(false);
    }

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!manga) {
    return <div className="text-center p-10 text-highlight">Manga not found.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4">
        <Image
          src={manga.images.webp.large_image_url}
          alt={manga.title}
          width={300}
          height={450}
          className="rounded-lg w-full"
          priority
        />
        <button
          onClick={() => toggleBookmark(mangaId)}
          className={`w-full mt-4 p-2 rounded-lg font-bold transition-colors ${
            isBookmarked(mangaId)
              ? 'bg-highlight text-white'
              : 'bg-accent hover:bg-highlight text-white'
          }`}
        >
          {isBookmarked(mangaId) ? 'Bookmarked' : 'Add to Bookmarks'}
        </button>
      </aside>

      <section className="w-full md:w-3/4">
        <h1 className="text-4xl font-bold text-primary">{manga.title}</h1>

        <div className="flex flex-wrap gap-2 my-4">
            {manga.genres.map((genre: Genre) => (
                <Link
                  href={`/?genre=${genre.mal_id}`}
                  key={genre.mal_id}
                  className="px-3 py-1 bg-secondary text-primary rounded-full text-sm hover:bg-accent"
                >
                  {genre.name}
                </Link>
            ))}
        </div>

        <h2 className="text-2xl font-semibold border-b border-secondary pb-2 mt-6">Synopsis</h2>
        <p className="mt-4 text-gray-300">{manga.synopsis}</p>

        <h2 className="text-2xl font-semibold border-b border-secondary pb-2 mt-8">Chapters</h2>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {chapters.length > 0 ? (
            chapters.map((chapterNumber) => (
              <div
                key={chapterNumber}
                className="bg-secondary p-4 rounded-lg hover:bg-accent transition-colors cursor-pointer text-center"
              >
                <p className="truncate">Chapter {chapterNumber}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-full">No chapter data available for this manga.</p>
          )}
        </div>
      </section>
    </div>
  );
}