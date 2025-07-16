'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Genre } from '../types';

export default function GenreFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Daftar genre yang ingin disembunyikan dari tampilan default.
  const genresToHide = new Set(['Erotica', 'Boys Love', 'Girls Love', 'Hentai', 'Adult Cast', 'Yaoi', 'Yuri', 'Mature', 'Ecchi', 'Magical Sex Shift', 'Crossdressing', 'Anthropomorphic']);

  // 1. Ambil genre dan bersihkan duplikat (tanpa pengurutan)
  useEffect(() => {
    fetch('https://api.jikan.moe/v4/genres/manga')
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          const uniqueGenresMap = new Map<number, Genre>();
          data.data.forEach((genre: Genre) => {
            uniqueGenresMap.set(genre.mal_id, genre);
          });
          const uniqueGenresArray = Array.from(uniqueGenresMap.values());
          setAllGenres(uniqueGenresArray);
        }
      });
  }, []);

  // 2. Sinkronkan genre yang dipilih dengan URL
  useEffect(() => {
    const genreIds = searchParams.get('genres')?.split(',') || [];
    if (allGenres.length > 0) {
      const initialSelected = allGenres.filter(g => genreIds.includes(String(g.mal_id)));
      setSelectedGenres(initialSelected);
    }
  }, [searchParams, allGenres]);

  // 3. Fungsi untuk menangani toggle genre
  const handleGenreToggle = useCallback((genre: Genre) => {
    let newSelected: Genre[];
    if (selectedGenres.some(g => g.mal_id === genre.mal_id)) {
      newSelected = selectedGenres.filter(g => g.mal_id !== genre.mal_id);
    } else {
      newSelected = [...selectedGenres, genre];
    }
    
    const params = new URLSearchParams(searchParams);
    if (newSelected.length > 0) {
      params.set('genres', newSelected.map(g => g.mal_id).join(','));
    } else {
      params.delete('genres');
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  }, [selectedGenres, searchParams, router]);
  
    const filteredGenres = allGenres.filter(genre => {
    const genreName = genre.name.toLowerCase();
    const isSensitive = genresToHide.has(genre.name);
    
    // Jika pengguna sedang mencari (kotak pencarian tidak kosong)...
    if (searchTerm.trim() !== '') {
      // ...maka tampilkan genre apa pun yang cocok, termasuk yang sensitif.
      return genreName.includes(searchTerm.toLowerCase());
    }
    
    // Jika pengguna tidak mencari...
    // ...maka hanya tampilkan genre yang TIDAK sensitif.
    return !isSensitive;
  });

  return (
    <div className="mb-8">
      {/* Area untuk menampilkan genre yang sudah dipilih */}
      {selectedGenres.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 justify-center items-center">
          <span className="text-gray-400 font-semibold mr-2">Filtered by:</span>
          {selectedGenres.map(genre => (
            <div key={genre.mal_id} className="flex items-center gap-2 bg-highlight text-white px-3 py-1 rounded-full text-sm">
              <span>{genre.name}</span>
              <button onClick={() => handleGenreToggle(genre)} className="font-bold text-lg leading-none">×</button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown untuk memilih genre */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full md:w-1/2 lg:w-1/3 p-3 bg-secondary rounded-lg flex justify-between items-center mx-auto"
        >
          <span className="text-gray-300">Choose Genres</span>
          <span className="text-primary">▼</span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-2 w-full md:w-1/2 lg:w-1/3 p-4 bg-dark border border-secondary rounded-lg shadow-lg left-1/2 -translate-x-1/2">
            <input
              type="text"
              placeholder="Search genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 bg-secondary text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
            />
            <div className="max-h-60 overflow-y-auto flex flex-wrap gap-2">
              {filteredGenres.map(genre => {
                const isSelected = selectedGenres.some(g => g.mal_id === genre.mal_id);
                if (isSelected) return null;
                return (
                  <button
                    key={genre.mal_id}
                    onClick={() => handleGenreToggle(genre)}
                    className="px-3 py-1 rounded-full text-sm font-semibold transition-colors bg-accent text-primary hover:bg-highlight"
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}