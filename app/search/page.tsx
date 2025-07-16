import { Manga } from '../types';
import MangaCard from '../components/MangaCard';
import PaginationControls from '../components/PaginationControls';

// Tipe props yang baru, di mana searchParams adalah sebuah Promise
type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  // --- KUNCI PERBAIKAN: Lakukan 'await' pada searchParams ---
  const awaitedSearchParams = await searchParams;
  const query = awaitedSearchParams['q'] ?? '';
  const page = awaitedSearchParams['page'] ?? '1';
  const limit = 20;

  const apiUrl = `https://api.jikan.moe/v4/manga?q=${query}&page=${page}&limit=${limit}`;

  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error('Failed to fetch search results');
  }
  const data = await res.json();
  const searchResults: Manga[] = data.data || [];
  const pagination = data.pagination;

  const hasNextPage = pagination?.has_next_page ?? false;
  const hasPrevPage = Number(page) > 1;

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">
        Search Results for: <span className="text-highlight">{query}</span>
      </h1>
      <PaginationControls hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} />
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {searchResults.map((manga) => (
            <MangaCard key={manga.mal_id} manga={manga} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No manga found for this search.</p>
      )}
      <PaginationControls hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} />
    </>
  );
}