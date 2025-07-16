import { Manga } from './types';
import MangaCard from './components/MangaCard';
import PaginationControls from './components/PaginationControls';
import GenreFilter from './components/GenreFilter';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams;
  const page = awaitedSearchParams['page'] ?? '1';
  const limit = 20;
  const genres = awaitedSearchParams['genres'] ?? '';

  let apiUrl: string;
  if (genres) {
    apiUrl = `https://api.jikan.moe/v4/manga?genres=${genres}&page=${page}&limit=${limit}&order_by=popularity`;
  } else {
    apiUrl = `https://api.jikan.moe/v4/top/manga?page=${page}&limit=${limit}`;
  }

  const res = await fetch(apiUrl, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch manga');
  }
  const data = await res.json();
  const mangaList: Manga[] = data.data || [];
  const pagination = data.pagination;

  const hasNextPage = pagination?.has_next_page ?? false;
  const hasPrevPage = Number(page) > 1;

  return (
    <>
      <GenreFilter />
      <PaginationControls hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {mangaList.length > 0 ? (
          mangaList.map((manga) => <MangaCard key={manga.mal_id} manga={manga} />)
        ) : (
          <p className="col-span-full text-center">No manga found for the selected criteria.</p>
        )}
      </div>
      <PaginationControls hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} />
    </>
  );
}