import { useQueryClient } from "@tanstack/react-query";
import * as Styled from "../styles/styled";
import { useRef, type FormEvent } from "react";
import { createCard } from "../api/createCard";

interface CreateCardFormProps {
  open: boolean;
  columnId: string;
  onClose: () => void;
}

export default function CreateCardForm({ open, columnId, onClose }: CreateCardFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = titleRef.current?.value;
    if (!title) {
      alert("Title is required");
      return;
    }
    try {
      await queryClient.fetchQuery({
        queryKey: ["cards", columnId],
        queryFn: () =>
          createCard({
            column_id: columnId,
            title,
            description: descriptionRef.current?.value,
            due_date: dueDateRef.current?.value,
          }),
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <Styled.CreateCardForm onSubmit={handleSubmit}>
      <input ref={titleRef} type="text" placeholder="Card title" />
      <textarea ref={descriptionRef} placeholder="Description" />
      <input ref={dueDateRef} type="date" />
      <button type="submit">Add</button>
    </Styled.CreateCardForm>
  );
}
