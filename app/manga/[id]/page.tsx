import MangaDetailView from './MangaDetailView';

interface PageProps {
  params: { id: string };
}

export default function MangaDetailPage({ params }: PageProps) {
  const { id } = params;

  return <MangaDetailView mangaId={id} />;
}