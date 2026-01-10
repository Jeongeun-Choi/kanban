import { useQueryClient } from "@tanstack/react-query";
import * as Styled from "../styles/styled";
import { useRef, type FormEvent } from "react";
import { createCard } from "../api/createCard";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import Textarea from "../../../shared/components/Textarea";

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
      <Input ref={titleRef} placeholder="Card title" fullWidth />
      <Textarea ref={descriptionRef} placeholder="Description" fullWidth />
      <Input ref={dueDateRef} type="date" fullWidth />
      <Styled.CreateCardButtons>
        <Button type="submit" variant="contained">
          Add
        </Button>
        <Button type="button" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Styled.CreateCardButtons>
    </Styled.CreateCardForm>
  );
}
