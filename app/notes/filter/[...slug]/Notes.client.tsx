"use client";

import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/types/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import css from "./NotesPage.module.css";

const PER_PAGE = 12;

export default function NotesClient({ tag }: { tag?: string }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError, error, isFetching } =
    useQuery<FetchNotesResponse>({
      queryKey: ["notes", page, debouncedSearch, tag],
      queryFn: () =>
        fetchNotes({
          page,
          perPage: PER_PAGE,
          search: debouncedSearch || undefined,
          ...(tag && tag !== "All" ? { tag } : {}),
        }),
      staleTime: 30_000,
      placeholderData: keepPreviousData,
    });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tag]);

  const notes = data?.notes ?? [];
  const pageCount = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
        {pageCount > 1 && (
          <Pagination
            currentPage={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        )}
      </header>

      {isLoading && <p style={{ padding: 16 }}>Loading...</p>}
      {isError && (
        <p style={{ padding: 16, color: "crimson" }}>
          {(error as Error)?.message || "Failed to load notes"}
        </p>
      )}

      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        !isLoading && !isFetching && <p style={{ padding: 16 }}>No notes yet</p>
      )}
    </div>
  );
}


