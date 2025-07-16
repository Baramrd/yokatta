import MangaDetailView from './MangaDetailView';

export default async function MangaDetailPage({ params }: { params: { id: string } }) {
  return <MangaDetailView mangaId={params.id} />;
}