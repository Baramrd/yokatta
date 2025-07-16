import { Metadata } from 'next';
import MangaDetailView from './MangaDetailView';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const id = params.id;
    const res = await fetch(`https://api.jikan.moe/v4/manga/${id}`);

    // Jika manga tidak ditemukan oleh API, berikan judul default
    if (!res.ok) {
      return {
        title: 'Manga Not Found | Yokatta',
      };
    }

    const data = await res.json();
    const manga = data?.data;

    // Jika data ada tapi kosong, berikan judul default
    if (!manga) {
      return {
        title: 'Manga Not Found | Yokatta',
      };
    }

    // Jika berhasil, kembalikan judul dan deskripsi dinamis
    return {
      title: `${manga.title} | Yokatta`,
      description: manga.synopsis ? manga.synopsis.substring(0, 160) : 'Read manga online at Yokatta',
    };
  } catch (error) {
    // Jika terjadi error saat fetch, berikan judul error
    console.error('Error in generateMetadata:', error);
    return {
      title: 'Server Error | Yokatta',
    };
  }
}

export default function MangaDetailPage({ params }: Props) {
  return <MangaDetailView mangaId={params.id} />;
}