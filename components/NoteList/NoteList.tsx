"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteMut = useMutation<Note, Error, string>({
    mutationFn: (id) => deleteNote(id),
    onMutate: (id) => setDeletingId(id),
    onError: () => setDeletingId(null),
    onSettled: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (!notes || notes.length === 0) {
    return <p>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content ?? ""}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

          <Link href={`/notes/${note.id}`} className={css.link}>
          View details
          </Link>


            <button
              className={css.button}
              onClick={() => deleteMut.mutate(note.id)}
              disabled={deletingId === note.id}
              aria-label={`Delete note ${note.title}`}
            >
              {deletingId === note.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
