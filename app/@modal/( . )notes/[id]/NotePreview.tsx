"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal";
import css from "@/app/notes/[id]/NoteDetails.module.css";

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();

  const { data: note, isLoading, error } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return null;
  if (error || !note) return null;

  return (
    <Modal isOpen={true} onClose={() => router.back()}>
      <div className={css.item}>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
        <p className={css.date}>
          Created: {new Date(note.createdAt).toLocaleDateString()}
        </p>
        <span className={css.tag}>{note.tag}</span>
      </div>
    </Modal>
  );
}
