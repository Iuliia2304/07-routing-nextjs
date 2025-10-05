import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NotePreviewClient from "./NotePreview";

export default async function NotePreviewPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}


