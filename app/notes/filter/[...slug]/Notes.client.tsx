"use client";

import { useEffect, useState, useMemo  } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/types/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./NotesPage.module.css";

const PER_PAGE = 12;

export default function NotesClient({ tag }: { tag?: string }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

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

  const header = useMemo(
    () => (
      <header className={css.toolbar}>
        <div style={{ flex: 1, display: "flex", gap: "16px" }}>
          <SearchBox
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
          {pageCount > 1 && (
            <Pagination currentPage={page} pageCount={pageCount} onPageChange={setPage} />
          )}
        </div>

        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>
    ),
    [search, page, pageCount]
  );

  return (
    <div className={css.app}>
      {header}

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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <NoteForm
          onCancel={() => setIsOpen(false)}
          onCreated={() => {
            setIsOpen(false);
            queryClient.invalidateQueries({ queryKey: ["notes"] });
          }}
        />
      </Modal>
    </div>
  );
}
