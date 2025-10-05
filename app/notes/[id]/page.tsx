import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import css from "./NoteDetails.module.css";

export default async function NoteDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <main className={css.container}>
      <HydrationBoundary state={dehydrate(qc)}>
        <NoteDetailsClient id={id} />
      </HydrationBoundary>
    </main>
  );
}


