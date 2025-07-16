import MangaDetailView from './MangaDetailView';

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function MangaDetailPage({ params }: PageProps) {
  const { id } = params;

  return <MangaDetailView mangaId={id} />;
}