import Link from 'next/link';
import Image from 'next/image';
import { Manga } from '../types';

interface MangaCardProps {
  manga: Manga;
}

export default function MangaCard({ manga }: MangaCardProps) {
  return (
    <Link href={`/manga/${manga.mal_id}`}>
      <div className="group">
        <Image
          src={manga.images.webp.large_image_url}
          alt={manga.title}
          width={225}
          height={320}
          className="rounded-lg object-cover w-full h-80 group-hover:opacity-75 transition-opacity"
        />
        <h3 className="text-md font-semibold mt-2 truncate text-primary group-hover:text-highlight">
          {manga.title}
        </h3>
        {/* GENRE DISPLAY */}
        <div className="text-xs text-gray-400 mt-1 truncate">
          {manga.genres.slice(0, 2).map(g => g.name).join(', ')}
        </div>
      </div>
    </Link>
  );
}