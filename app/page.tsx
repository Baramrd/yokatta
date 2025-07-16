import { Manga } from './types';
import MangaCard from './components/MangaCard';
import PaginationControls from './components/PaginationControls';
import GenreFilter from './components/GenreFilter';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams['page'] ?? '1';
  const limit = 20;
  const genres = searchParams['genres'] ?? '';

  let apiUrl: string;

  if (genres) {
    // JIKA GENRE DIPILIH:
    // Endpoint /manga digunakan untuk mendapatkan daftar manga berdasarkan genre.
    // Urutkan manga berdasarkan popularitas dalam genre tersebut.
    apiUrl = `https://api.jikan.moe/v4/manga?genres=${genres}&page=${page}&limit=${limit}&order_by=popularity`;
  } else {
    // JIKA TIDAK ADA FILTER:
    // Tetap gunakan endpoint /top/manga untuk daftar peringkat terbaik secara umum.
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