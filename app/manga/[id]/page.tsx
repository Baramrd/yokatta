import { Metadata } from 'next';
import MangaDetailView from './MangaDetailView';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`https://api.jikan.moe/v4/manga/${id}`);
    if (!res.ok) { return { title: 'Manga Not Found | Yokatta' }; }
    const { data: manga } = await res.json();
    if (!manga) { return { title: 'Manga Not Found | Yokatta' }; }
    return {
      title: `${manga.title} | Yokatta`,
      description: manga.synopsis ? manga.synopsis.substring(0, 160) : 'Read manga online at Yokatta',
    };
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    return { title: 'Server Error | Yokatta' };
  }
}

export default async function MangaDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <MangaDetailView mangaId={id} />;
}