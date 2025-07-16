import { Manga } from '../types';
import MangaCard from '../components/MangaCard';
import PaginationControls from '../components/PaginationControls';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams['q'] ?? '';
  const page = searchParams['page'] ?? '1';
  const limit = 20;

  let apiUrl = `https://api.jikan.moe/v4/manga?q=${query}&page=${page}&limit=${limit}`;

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
      {/* Pass the hasPrevPage prop to the component */}
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
      {/* Pass the hasPrevPage prop to the component */}
      <PaginationControls hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} />
    </>
  );
}