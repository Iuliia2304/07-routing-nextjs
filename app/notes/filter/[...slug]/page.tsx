
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import css from "./NotesPage.module.css";

export default async function NotesPage({ params }: { params: Promise<{ slug: string[] } > }) {
  const { slug } = await params; 
  const tag = slug?.[0] === "All" ? undefined : slug[0]; 

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag }),
  });

  return (
    <main className={css.container}>
      <HydrationBoundary state={dehydrate(qc)}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    </main>
  );
}





