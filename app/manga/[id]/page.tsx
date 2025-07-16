// app/manga/[id]/page.tsx
import { Metadata } from 'next';
import MangaDetailView from './MangaDetailView';

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Manga Detail #${params.id}`,
  };
}

export default async function MangaDetailPage({ params }: PageProps) {
  return <MangaDetailView mangaId={params.id} />;
}
